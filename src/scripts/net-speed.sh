#!/bin/sh
# Display / sleep interval
SLP=1

# Function to get current RX and TX for an interface
get_interface_data() {
  INTERFACE=$1
  LINE=$(grep $INTERFACE /proc/net/dev | sed s/.*://)
  RECEIVED=$(echo $LINE | awk '{print $1}')
  TRANSMITTED=$(echo $LINE | awk '{print $9}')
  echo "$RECEIVED $TRANSMITTED"
}

# Infinite loop to continuously output the network speed
while true; do
  # First read - sum for all interfaces
  RECEIVED1=0
  TRANSMITTED1=0
  for INTERFACE in $(grep \: /proc/net/dev | awk -F: '{print $1}' | sed 's/ //g'); do
    DATA=$(get_interface_data $INTERFACE)
    RECEIVED1=$(($RECEIVED1 + $(echo $DATA | awk '{print $1}')))
    TRANSMITTED1=$(($TRANSMITTED1 + $(echo $DATA | awk '{print $2}')))
  done

  # Sleep for the interval
  sleep $SLP

  # Second read - sum for all interfaces
  RECEIVED2=0
  TRANSMITTED2=0
  for INTERFACE in $(grep \: /proc/net/dev | awk -F: '{print $1}' | sed 's/ //g'); do
    DATA=$(get_interface_data $INTERFACE)
    RECEIVED2=$(($RECEIVED2 + $(echo $DATA | awk '{print $1}')))
    TRANSMITTED2=$(($TRANSMITTED2 + $(echo $DATA | awk '{print $2}')))
  done

  # Calculate speeds
  INSPEED=$(($RECEIVED2 - $RECEIVED1))
  OUTSPEED=$(($TRANSMITTED2 - $TRANSMITTED1))
  TOTALSPEED=$(($INSPEED + $OUTSPEED))

  # Convert to KB/s
  INSPEED_KB=$(($INSPEED / 1024 / $SLP))
  OUTSPEED_KB=$(($OUTSPEED / 1024 / $SLP))
  TOTALSPEED_KB=$(($TOTALSPEED / 1024 / $SLP))

  # Output speeds as a single line
  echo "${INSPEED_KB}|${OUTSPEED_KB}|${TOTALSPEED_KB}"
done
