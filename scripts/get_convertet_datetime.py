import datetime

# Provided timestamp in nanoseconds
timestamp_ns = 1_715_956_788_173_025_710


# Convert nanoseconds to seconds
timestamp_s = timestamp_ns / 1e9

# Convert to datetime and get ISO format
iso_format_date = datetime.datetime.fromtimestamp(timestamp_s).isoformat()

print(iso_format_date)
