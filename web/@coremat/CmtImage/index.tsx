import React from 'react';

const CmtImage = ({ alt, ...restProps }: any) => {
  const altValue = alt ? alt : '';
  return <img alt={altValue} {...restProps} />;
};

export default CmtImage;
