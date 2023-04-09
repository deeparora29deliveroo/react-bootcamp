#!/bin/bash
rm -rf scripts
rm babel.config.json
yarn remove execa @babel/cli @babel/core
yarn lint --fix