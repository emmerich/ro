import { PropTypes } from 'react';

export default PropTypes.shape({
  data: PropTypes.arrayOf(PropTypes.shape({
    slice: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
  })).isRequired,
});
