import { Link } from "react-router-dom"
import "./CampaignSingle.css"
const CampaignSingle = () => {
  return (
    <section className="campaign-single">
    <div className="container">
      <div className="campaign-wrapper">
        <h2>İlk Aya Özel</h2>
        <strong>Seçili Ürünlerde %40'A Varan İndirim </strong>
        <span></span>
        <Link to={"shop"} className="btn btn-lg">
          İncele
          <i className="bi bi-arrow-right"></i>
        </Link>
      </div>
    </div>
  </section>  )
}

export default CampaignSingle