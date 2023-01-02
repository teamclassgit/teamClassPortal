// @packages
import PropTypes from "prop-types";
import { Card, CardBody } from "reactstrap";

const StatsVertical = ({ icon, color, stats, statTitle, className, ...rest }) => {
  return (
    <Card className='text-center'>
      <CardBody className={className}>
        <div className={`avatar p-50 m-0 mb-1 ${color ? `bg-light-${color}` : "bg-light-primary"}`}>
          <div className='avatar-content'>{icon}</div>
        </div>
        <h2 className='font-weight-bolder'>{stats}</h2>
        <p className='card-text line-ellipsis'>{statTitle}</p>
      </CardBody>
    </Card>
  );
};

export default StatsVertical;

StatsVertical.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  statTitle: PropTypes.string.isRequired,
  stats: PropTypes.string.isRequired
};
