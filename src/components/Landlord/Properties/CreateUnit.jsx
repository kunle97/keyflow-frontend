import React from "react";

const CreateUnit = () => {
  return (
    <div className="container-fluid">
      <div className="row mb-3">
        <div className="col-sm-12 col-md-12 col-lg-8 offset-sm-0 offset-md-0 offset-lg-2">
          <h3 className="text-white mb-4">Add Unit to [Property Name]</h3>
          <div className="card shadow mb-3">
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label className="form-label text-white" htmlFor="address">
                    <strong>Unit #/Name</strong>
                  </label>
                  <input
                    className="form-control text-black"
                    type="text"
                    id="address"
                    placeholder="Sunset Blvd, 38"
                    name="address"
                    required
                    style={{ borderStyle: "none", color: "rgb(255,255,255)" }}
                  />
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div>
                      <label className="form-label text-white">Beds</label>
                      <input
                        className="form-control text-black "
                        type="number"
                        name="beds"
                        defaultValue={1}
                        required
                        style={{
                          borderStyle: "none",
                          color: "rgb(255,255,255)",
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div>
                      <label className="form-label text-white">Baths</label>
                      <input
                        className="form-control text-black "
                        type="number"
                        name="baths"
                        defaultValue={1}
                        required
                        style={{
                          borderStyle: "none",
                          color: "rgb(255,255,255)",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-end my-3">
                  <button className="btn btn-primary ui-btn" type="submit">
                    Create Unit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUnit;
