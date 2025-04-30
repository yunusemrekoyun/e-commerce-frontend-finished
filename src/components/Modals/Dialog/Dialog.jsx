import "./Dialog.css";
import PropTypes from "prop-types";

const Dialog = ({ isDialogShow, setIsDialogShow }) => {
  const handleCloseDialog = (event) => {
    const checked = event.target.checked;

localStorage.setItem("dialog", JSON.stringify(!checked))

  };

  return (
    <div className={`modal-dialog ${isDialogShow ? "show" : ""} `}>
      <div className="modal-content">
        <button className="modal-close" onClick={() => setIsDialogShow(false)}>
          <i className="bi bi-x"></i>
        </button>
        <div className="modal-image">
        <img src="/img/modal-dialog.jpg" alt="" />
        </div>
        <div className="popup-wrapper">
          <div className="popup-content">
            <div className="popup-title">
              <h3>İndirimli Ürünleri Kaçırmayın!</h3>
            </div>
            <p className="popup-text">
            
            </p>
            <form className="popup-form">
              <input type="text" placeholder="Email adresinizi giriniz" />
              <button className="btn btn-primary">BENİ İNDİRİMLERDEN HABERDAR ET</button>
              <label>
                <input type="checkbox" onChange={handleCloseDialog} />
                <span>Bir daha gösterme.</span>
              </label>
            </form>
          </div>
        </div>
      </div>
      <div
        className="modal-overlay"
        onClick={() => setIsDialogShow(false)}
      ></div>
    </div>
  );
};

export default Dialog;

Dialog.propTypes = {
  setIsDialogShow: PropTypes.func,
  isDialogShow: PropTypes.bool,
};
