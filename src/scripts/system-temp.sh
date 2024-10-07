#!/bin/bash

# Get CPU temperatures
cpu_temps=$(sensors | grep 'Core' | awk '{print $3}' | tr -d '+°C')
# Calculate average CPU temperature
avg_cpu_temp=$(echo "$cpu_temps" | awk '{ sum += $1 } END { if (NR > 0) print sum / NR }')

# Get NVMe temperature (match "Composite" line)
nvme_temp=$(sensors | grep -A 0 'nvme-pci-e100' | grep 'Composite' | awk '{print $2}' | tr -d '+°C')

# Get system/motherboard temperature (acpitz)
acpitz_temp=$(sensors | grep 'acpitz-acpi-0' | awk '{print $2}' | tr -d '+°C')

# Print results
echo "Average CPU Temperature: $avg_cpu_temp°C"
echo "NVMe Temperature: $nvme_temp°C"
echo "System/Motherboard Temperature: $acpitz_temp°C"
