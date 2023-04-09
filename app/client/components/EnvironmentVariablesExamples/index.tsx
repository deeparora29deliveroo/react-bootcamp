import React, { useEffect, useState } from 'react';
import fetch from '@deliveroo/fetch';
import { Text } from '@deliveroo/tools-component-library';

import logger from '../../utils/logger';
import './styles.scss';

const EnvironmentVariablesExamples: React.FC = () => {
  const [serverEnvVars, setServerResponse] = useState(null);

  const loadData = async () => {
    try {
      const response = await fetch('/env', { snakeCaseTransform: false });

      setServerResponse(response.json);
    } catch (err) {
      logger.error(err as Error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const publicEnvVars: Record<string, string> = {};

  Object.keys(process.env).forEach((key) => {
    if (key.includes('PUBLIC_')) {
      publicEnvVars[key] = process.env[key]!;
    }
  });

  return (
    <>
      <br />
      <Text>Environment variables that the client has access to:</Text>
      <pre>{JSON.stringify(publicEnvVars, null, 2)}</pre>
      <br />
      <Text>Environment variables that the server has access to:</Text>
      <pre>{JSON.stringify(serverEnvVars, null, 2)}</pre>
    </>
  );
};

export default EnvironmentVariablesExamples;
