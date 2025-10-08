import './UI.css';

export const FooterPage = () => {
  return (
    <div className="maincontainer">
      <div className="contactussection">
        <center>
          <h1 className="contactusheading">Contact us</h1>
        </center>

        <div className="followuscontainer">
          <i className="fa-brands fa-facebook icon3"></i>
          <i className="fa-brands fa-twitter icon4"></i>
          <i className="fa-brands fa-linkedin-in icon5"></i>
          <i className="fa-brands fa-youtube icon6"></i>
          <i className="fa-brands fa-instagram icon7"></i>
        </div>

        <p className="mb-0">&copy; 2025 3Edge Solutions. All rights reserved.</p>
      </div>
    </div>
  );
};
