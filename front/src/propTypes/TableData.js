import { PropTypes } from 'react';

export default PropTypes.shape({
  rows: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]))).isRequired,
});
