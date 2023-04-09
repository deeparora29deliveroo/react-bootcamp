import React, { useState } from 'react';
import fetch from '@deliveroo/fetch';
import { Button, Text } from '@deliveroo/tools-component-library';

import logger from '../../utils/logger';

const DataLoaderExample: React.FC = () => {
  const [sampleData, setSampleData] = useState(null);
  const [identityData, setIdentityData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadData = async () => {
    setIsLoading(true);

    try {
      const [apiSampleData, apiIdentityData] = await Promise.all([
        fetch('/api/sample'),
        fetch('/api/session'),
      ]);

      setSampleData(apiSampleData.json);
      setIdentityData(apiIdentityData.json);
    } catch (err) {
      logger.error(err as Error);
    }
    setIsLoading(false);
  };

  const reset = () => {
    setSampleData(null);
    setIdentityData(null);
  };

  if (!(sampleData || identityData) || isLoading) {
    return <Button onClick={loadData} isLoading={isLoading} label="Load Sample API Data" />;
  }

  if (sampleData && identityData) {
    return (
      <>
        <Text>
          <Text bold>
            Data from <code>/api/sample</code>:
          </Text>
          <pre>{JSON.stringify(sampleData, null, 2)}</pre>
        </Text>
        <br />
        <Text>
          <Text bold>
            Data from <code>/api/session</code>:
          </Text>
          <pre>{JSON.stringify(identityData, null, 2)}</pre>
        </Text>
        <br />
        <Button isDestructive onClick={reset} label="Reset" />
      </>
    );
  }

  return null;
};

export default DataLoaderExample;
