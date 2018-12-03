[
  'buildComponent',
  'generateWebpackConfig',
].forEach((m) => {
  Object.assign(exports, require(`./${m}`));
});
