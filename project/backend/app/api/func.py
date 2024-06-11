import datetime
import pytz

def convertTime(unix_time):
  utc_datetime = datetime.datetime.utcfromtimestamp(unix_time)
  utc_timezone = pytz.timezone('UTC')
  utc_aware_datetime = utc_timezone.localize(utc_datetime)
  utc_plus_7_timezone = pytz.timezone('Asia/Bangkok')  # UTC+7 is Bangkok time
  utc_plus_7_aware_datetime = utc_aware_datetime.astimezone(utc_plus_7_timezone)
  return utc_plus_7_aware_datetime