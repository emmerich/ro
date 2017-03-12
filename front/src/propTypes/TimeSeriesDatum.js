import { PropTypes } from 'react';

export default PropTypes.shape({
  data: PropTypes.arrayOf(PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  })).isRequired,
});
