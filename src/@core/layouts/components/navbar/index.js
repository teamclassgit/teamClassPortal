// @packages
import NavbarUser from './NavbarUser';
import PropTypes from 'prop-types';

const ThemeNavbar = ({ skin, setSkin, setMenuVisibility }) => (
  <NavbarUser skin={skin} setSkin={setSkin} setMenuVisibility={setMenuVisibility} />
)

export default ThemeNavbar

ThemeNavbar.propTypes = {
  skin: PropTypes.string,
  setSkin: PropTypes.func,
  setMenuVisibility: PropTypes.func
}
