import React, { PropsWithChildren } from 'react';

function Paper(
  props: PropsWithChildren<React.DetailsHTMLAttributes<HTMLDivElement>>
) {
  return <div className="relative" {...props} />;
}

export default Paper;
