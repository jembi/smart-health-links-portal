'use client';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

type Props = {
  spec: Record<string, any>;
  url: string | undefined;
};

function ReactSwagger({ spec, url }: Props) {
  if (process.env.NODE_ENV === 'development') {
    return <SwaggerUI spec={spec} />;
  }

  return <SwaggerUI url={url} />;
}

export default ReactSwagger;
