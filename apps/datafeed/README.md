celery -A datafeed worker -l info -P solo
celery -A datafeed beat -l info
