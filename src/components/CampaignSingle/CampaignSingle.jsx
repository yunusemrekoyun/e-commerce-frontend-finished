import { Link } from "react-router-dom"
import "./CampaignSingle.css"
const CampaignSingle = () => {
  return (
    <section className="campaign-single">
    <div className="container">
      <div className="campaign-wrapper">
        <h2>New Season Sale</h2>
        <strong>40% OFF</strong>
        <span></span>
        <Link to={"/shop"} className="btn btn-lg">
          SHOP NOW
          <i className="bi bi-arrow-right"></i>
        </Link>
      </div>
    </div>
  </section>  )
}

export default CampaignSingle