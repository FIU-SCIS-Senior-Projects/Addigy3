#!/bin/bash

FILE="adgcollector.cron"
echo "...Creating cronjob file '$FILE'"

CRON_FILE="${HOME}/addigy/adgcollector.cron"
CRON_JOB="*/10 * * * * java -jar ${HOME}/addigy/adgcollector-1.0-SNAPSHOT-jar-with-dependencies.jar 1>/dev/null 2>&1"
echo "${CRON_JOB}" > ${CRON_FILE}

echo "...Adding cronjob to crontab"
crontab ${CRON_FILE}

echo "...Succesfully updated crontab contents:"
crontab -l
