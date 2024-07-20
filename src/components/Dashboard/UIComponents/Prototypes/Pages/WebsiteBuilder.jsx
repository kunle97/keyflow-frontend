import React, { useState } from "react";
import UIInput from "../../UIInput";
import { Button, Select, Stack } from "@mui/material";
import UIButton from "../../UIButton";
import Slider from "react-slick";
import { uiGreen } from "../../../../../constants";
import ProgressModal from "../../Modals/ProgressModal";
import AlertModal from "../../Modals/AlertModal";
const WebsiteBuilder = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
  };
  const themeColors = [
    { name: "Cinnabar", color: "#e74c3c" },
    { name: "Pomegranate", color: "#f22613" },
    { name: "Sunglo", color: "#e26a6a" },
    { name: "Wax Flower", color: "#f1a9a0" },
    { name: "Light Wisteria", color: "#be90d4" },
    { name: "Medium Purple", color: "#bf55ec" },
    { name: "Rebecca Purple", color: "#663399" },
    { name: "Studio", color: "#8e44ad" },
    { name: "Alice Blue", color: "#e4f1fe" },
    { name: "Dodger Blue", color: "#19b5fe" },
    { name: "Ebony Clay", color: "#22313f" },
    { name: "Jordy Blue", color: "#89c4f4" },
    { name: "Madison", color: "#2c3e50" },
    { name: "Pickled Bluewood", color: "#34495e" },
    { name: "Royal Blue", color: "#4183d7" },
    { name: "San Marino", color: "#446cb3" },
    { name: "Aqua Island", color: "#a2ded0" },
    { name: "Caribbean Green", color: "#03c9a9" },
    { name: "Downy", color: "#65c6bb" },
    { name: "Eucalyptus", color: "#26a65b" },
    { name: "Free Speech Aquamarine", color: "#03a678" },
    { name: "Green Haze", color: "#019875" },
    { name: "Jade", color: "#00b16a" },
    { name: "Light Sea Green", color: "#1ba39c" },
    { name: "Mountain Meadow 2", color: "#16a085" },
    { name: "Niagara", color: "#2abb9b" },
    { name: "Ocean Green", color: "#4daf7c" },
    { name: "Salem", color: "#1e824c" },
    { name: "Cream Can", color: "#f5d76e" },
    { name: "Burnt Orange", color: "#d35400" },
    { name: "Cape Honey", color: "#fde3a7" },
    { name: "Crusta", color: "#f2784b" },
    { name: "Fire Bush", color: "#eb9532" },
    { name: "Jaffa", color: "#db974e" },
  ];
  const templates = [
    {
      id: 1,
      name: "Haven",
      path: "/assets/img/website-builder-templates/template1.png",
    },
    {
      id: 2,
      name: "Modern Living",
      path: "/assets/img/website-builder-templates/template2.png",
    },
    {
      id: 3,
      name: "395 Tolert",
      path: "/assets/img/website-builder-templates/template3.png",
    },
    {
      id: 4,
      name: "Real home",
      path: "/assets/img/website-builder-templates/template4.png",
    },
    // {
    //   id: 5,
    //   name: "Lavish",
    //   path: "/assets/img/website-builder-templates/template1.png",
    // },
    // {
    //   id: 6,
    //   name: "Estate",
    //   path: "/assets/img/website-builder-templates/template2.png",
    // },
    // {
    //   id: 7,
    //   name: "Mansion",
    //   path: "/assets/img/website-builder-templates/template3.png",
    // },
    // {
    //   id: 8,
    //   name: "Luxury",
    //   path: "/assets/img/website-builder-templates/template4.png",
    // },
  ];
  const previewWebsite = () => {


    //Navigate to the image of the selected template
    window.location.href = templates.find(
      (template) => template.id === selectedTemplate
    ).path;
  };

  const handleSubmit = () => {
    //Show the loading progress modal for 3 seconds and then show the alert modal
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowAlert(true);
    }, 3000);
  };

  return (
    <div className="container">
      <ProgressModal open={isLoading} title="Publishing Website" />
      <AlertModal
        open={showAlert}
        title="Published Website"
        message="Your website has been published successfully!"
        btnText="Close"
        onClick={() => setShowAlert(false)}
      />

      <div className="website-details">
        <h3>Website Builder</h3>
        <div className="row"></div>

        <div className="card">
          <div className="card-body">
            <h4>Select a Template</h4>
            <Slider {...settings}>
              {templates.map((template) => {
                return (
                  <Stack
                    sx={{
                      padding: "0 10px",

                      // borderRadius: "5px",
                      padding: "5px 0",
                    }}
                    spacing={2}
                  >
                    <div
                      style={{
                        height: "200px",
                        overflow: "hidden",
                        borderBottom:
                          selectedTemplate === template.id
                            ? "4px solid " + uiGreen
                            : "",
                      }}
                    >
                      <img
                        src={template.path}
                        alt={template.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <h5 style={{ width: "100%" }}>{template.name} </h5>
                    <Button
                      variant="text"
                      btnText="Select"
                      sx={{
                        color: uiGreen,
                        textTransform: "none",
                        width: "100%",
                      }}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      Select Template
                    </Button>
                  </Stack>
                );
              })}
            </Slider>
            <form className="mt-5">
              <div className="row">
                <div className="col-md-6 align-self-center mb-3">
                  <div className="form-group">
                    <label htmlFor="website-name" className="text-black">
                      Company Name
                    </label>
                    <UIInput
                      type="text"
                      className="form-control"
                      id="website-name"
                    />
                  </div>
                </div>
                <div className="col-md-6 align-self-center mb-3">
                  <div className="form-group">
                    <label htmlFor="website-url" className="text-black">
                      Headline Text
                    </label>
                    <UIInput
                      type="text"
                      className="form-control"
                      id="website-url"
                    />
                  </div>
                </div>
                <div className="col-md-6 align-self-center mb-3">
                  <div className="form-group">
                    <label htmlFor="website-url" className="text-black">
                      Headline Subtitle
                    </label>
                    <UIInput
                      type="text"
                      className="form-control"
                      id="website-url"
                    />
                  </div>
                </div>
                <div className="col-md-6 align-self-center mb-3">
                  <div className="form-group">
                    <label className="text-black">Theme Color</label>
                    <div></div>
                    {themeColors.map((color) => {
                      return (
                        <div
                          onClick={() => setSelectedColor(color.color)}
                          style={{
                            width: "20px",
                            height: "20px",
                            background: color.color,
                            cursor: "pointer",
                            display: "inline-block",
                          }}
                        ></div>
                      );
                    })}
                    <br />
                    <span className="text-black">
                      Selected Color:{" "}
                      <div
                        style={{
                          width: "220px",
                          height: "20px",
                          background: selectedColor,
                        }}
                      ></div>
                    </span>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group mb-2">
                    {" "}
                    <div>
                      <img
                        src="https://placehold.co/200x200"
                        alt="logo"
                        className="img-thumbnail"
                        style={{
                          marginBottom: "10px",
                        }}
                      />
                    </div>
                    <label htmlFor="website-url" className="text-black">
                      Logo
                    </label>
                    <UIInput
                      type="file"
                      className="form-control"
                      id="website-url"
                    />{" "}
                  </div>
                </div>
                <div className="col-md-6 align-self-center mb-3">
                  <div className="form-group mb-2">
                    <div>
                      <img
                        src="https://placehold.co/400x200"
                        alt="logo"
                        className="img-thumbnail"
                        style={{
                          marginBottom: "10px",
                        }}
                      />
                    </div>
                    <label htmlFor="website-url" className="text-black">
                      Background Image
                    </label>
                    <UIInput
                      type="file"
                      className="form-control"
                      id="website-url"
                    />{" "}
                  </div>
                </div>
              </div>
              <Stack
                direction="row"
                spacing={2}
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <UIButton btnText="Preview" onClick={previewWebsite} />
                <UIButton btnText="Publish" onClick={handleSubmit} />
              </Stack>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteBuilder;
