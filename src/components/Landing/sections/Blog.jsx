import React from "react";
import UIButton from "../../Dashboard/UIComponents/UIButton";

const Blog = () => {
  const blogs = [
    {
      title: "Boosting Property Management Efficiency: Tools and Techniques",
      img: "/assets/img/house4.jpg",
      text: "Efficiency is the cornerstone of successful property management. Embrace technology; property management software centralizes tasks, automates rent collection, and streamlines communication. Regular property inspections help identify maintenance needs early, preventing costly repairs. Create robust lease agreements outlining tenant responsibilities and property rules. Cultivate tenant relationships through open communication and swift issue resolution. Consider outsourcing tasks; professional property managers offer expertise in tenant relations, maintenance coordination, and legal compliance, freeing your time for strategic decision-making. Continuously educate yourself on industry trends, regulations, and innovative tools to stay ahead in the competitive property management landscape.",
      link: "/#blog",
    },
    {
      title: "Efficient Rental Property Management: Key Steps for Success",
      img: "/assets/img/house3.jpg",
      text: "Owning rental properties offers lucrative opportunities but demands effective management. Start by understanding your market, setting competitive rents, and screening tenants meticulously. Prioritize regular property maintenance to retain value and keep tenants satisfied. Communication remains pivotal—establish clear terms, address concerns promptly, and facilitate convenient payment methods. Embrace technology; property management software like KeyFlow streamlines operations, from automated rent collection to maintenance tracking. Lastly, stay updated on regulations to ensure compliance and protect both your property and tenants. Efficient property management isn't just about profit; it's about creating a safe and thriving living environment.",
      link: "/#blog",
    },
    {
      title:
        "Navigating the World of Property Investing: Strategies for Success",
      img: "/assets/img/house7.jpg",
      text: "Property investing presents diverse avenues to build wealth. Start by defining your investment goals—whether it's rental income, long-term appreciation, or a mix of both. Research markets thoroughly; look for emerging areas with potential growth or stable markets for consistent returns. Diversify your portfolio by considering various property types—single-family homes, multifamily units, or commercial spaces. Always conduct due diligence; evaluate the property's condition, potential renovation costs, and market demand. Leveraging financing wisely and partnering with professionals like real estate agents and property managers can further optimize your investment strategy.",
      link: "/#blog",
    },
  ];

  return (
    <section className="mb-5 landing-section">
      <div className="container">
        {" "}
        <div className="section-header">
          <h2>Landlord Guide</h2>
          <p>
            Check out our blog for tips and tricks on becoming a better
            landlord.&nbsp;
          </p>
        </div>
        <div className="row">
          {blogs.map((blog) => (
            <div className="col-md-4 mb-3">
              <div
                style={{
                  height: "220px",
                  overflow: "hidden",
                  marginBottom: "20px",
                }}
              >
                <img src={blog.img} style={{ width: "100%" }} />
              </div>
              <h5 style={{ color: "black" }}>{blog.title}</h5>
              <p
                style={{
                  color: "black",
                  height: "150px",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                {blog.text}
              </p>
              <UIButton btnText="Read More" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
