#!/bin/bash

# 変数
REMOTE_HOST_DEV=test-sample
REMOTE_HOST_STG=test-sample
REMOTE_HOST_PRD=sample
REMOTE_PATH_DEV=/home/www/frontend/manage/docroot/sample/
REMOTE_PATH_STG=/home/www/xgnst/docroot/sample/
REMOTE_PATH_PRD=/home/www/xgnst/docroot/sample/
LOCAL_PATH=${WORKSPACE}/dist/
SRC_PATH=${WORKSPACE}/src/

if [ "${TARGET}" = "dev" ] ; then
  REMOTE_HOST=$REMOTE_HOST_DEV
  REMOTE_PATH=$REMOTE_PATH_DEV
elif [ "${TARGET}" = "stg" ] ; then
  REMOTE_HOST=$REMOTE_HOST_STG
  REMOTE_PATH=$REMOTE_PATH_STG
elif [ "${TARGET}" = "prd" ] ; then
  REMOTE_HOST=$REMOTE_HOST_PRD
  REMOTE_PATH=$REMOTE_PATH_PRD
else
  echo -e "\n\n*** REMOTE_HOSTが設定できませんでした ***\n\n"
  exit
fi

# コマンド
RSYNC="rsync -rlcv --delete"

# rsync
if ${DRYRUN} ; then
  # dryrun
  echo -e "\n\n*** dryrun ***"
  if [ "${TARGET}" = "dev" ] ; then
    $RSYNC -n $LOCAL_PATH $REMOTE_HOST:$REMOTE_PATH
  elif [ "${TARGET}" = "dev" ] ; then
    $RSYNC -n $LOCAL_PATH $REMOTE_HOST:$REMOTE_PATH
  else
    $RSYNC -n --exclude '*.html' --exclude 'json/' $LOCAL_PATH $REMOTE_HOST:$REMOTE_PATH
  fi
  echo -e "*** dryrun done ***\n\n"
else
  # deploy
  echo -e "\n\n*** deploy ***"
  if [ "${TARGET}" = "dev" ] ; then
    $RSYNC $LOCAL_PATH $REMOTE_HOST:$REMOTE_PATH
  elif [ "${TARGET}" = "dev" ] ; then
    $RSYNC $LOCAL_PATH $REMOTE_HOST:$REMOTE_PATH
  else
    $RSYNC --exclude '*.html' --exclude 'json/' $LOCAL_PATH $REMOTE_HOST:$REMOTE_PATH
  fi
  echo -e "*** deploy done ***\n\n"
fi
