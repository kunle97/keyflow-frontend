import React from "react";

const CreateProperty = () => {
  return (
    <div className="container-fluid">
      <div className="row mb-3">
        <div className="col-sm-12 col-md-12 col-lg-8 offset-sm-0 offset-md-0 offset-lg-2">
          <h3 className="text-white mb-4">Add Property</h3>
          <div className="card shadow mb-3">
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label className="form-label text-white" htmlFor="address">
                    <strong>Name</strong>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    id="address"
                    placeholder="Lynx Society Highrises"
                    required
                    name="name"
                    style={{ borderStyle: "none" }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-white" htmlFor="address">
                    <strong>Address</strong>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    id="address-1"
                    placeholder="Sunset Blvd, 38"
                    name="address"
                    required
                    style={{ borderStyle: "none" }}
                  />
                </div>
                <div className="row">
                  <div className="col">
                    <div className="mb-3">
                      <label className="form-label text-white" htmlFor="city">
                        <strong>City</strong>
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        id="city"
                        placeholder="Los Angeles"
                        name="city"
                        required
                        style={{ borderStyle: "none" }}
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="mb-3">
                      <label
                        className="form-label text-white"
                        htmlFor="country"
                      >
                        <strong>State</strong>
                      </label>
                      <select className="form-select">
                        <option value>--</option>
                        <option value="AL">Alabama</option>
                        <option value="AK">Alaska</option>
                        <option value="AZ">Arizona</option>
                        <option value="AR">Arkansas</option>
                        <option value="CA">California</option>
                        <option value="CO">Colorado</option>
                        <option value="CT">Connecticut</option>
                        <option value="DE">Delaware</option>
                        <option value="DC">District Of Columbia</option>
                        <option value="FL">Florida</option>
                        <option value="GA">Georgia</option>
                        <option value="HI">Hawaii</option>
                        <option value="ID">Idaho</option>
                        <option value="IL">Illinois</option>
                        <option value="IN">Indiana</option>
                        <option value="IA">Iowa</option>
                        <option value="KS">Kansas</option>
                        <option value="KY">Kentucky</option>
                        <option value="LA">Louisiana</option>
                        <option value="ME">Maine</option>
                        <option value="MD">Maryland</option>
                        <option value="MA">Massachusetts</option>
                        <option value="MI">Michigan</option>
                        <option value="MN">Minnesota</option>
                        <option value="MS">Mississippi</option>
                        <option value="MO">Missouri</option>
                        <option value="MT">Montana</option>
                        <option value="NE">Nebraska</option>
                        <option value="NV">Nevada</option>
                        <option value="NH">New Hampshire</option>
                        <option value="NJ">New Jersey</option>
                        <option value="NM">New Mexico</option>
                        <option value="NY">New York</option>
                        <option value="NC">North Carolina</option>
                        <option value="ND">North Dakota</option>
                        <option value="OH">Ohio</option>
                        <option value="OK">Oklahoma</option>
                        <option value="OR">Oregon</option>
                        <option value="PA">Pennsylvania</option>
                        <option value="RI">Rhode Island</option>
                        <option value="SC">South Carolina</option>
                        <option value="SD">South Dakota</option>
                        <option value="TN">Tennessee</option>
                        <option value="TX">Texas</option>
                        <option value="UT">Utah</option>
                        <option value="VT">Vermont</option>
                        <option value="VA">Virginia</option>
                        <option value="WA">Washington</option>
                        <option value="WV">West Virginia</option>
                        <option value="WI">Wisconsin</option>
                        <option value="WY">Wyoming</option>
                      </select>
                    </div>
                  </div>
                  <div className="col">
                    <div className="mb-3">
                      <label
                        className="form-label text-white"
                        htmlFor="country"
                      >
                        <strong>Country</strong>
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        id="country-1"
                        placeholder="USA"
                        name="country"
                        required
                        style={{ borderStyle: "none" }}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div>
                      <label className="form-label text-white">Beds</label>
                      <input
                        className="form-control form-control"
                        type="number"
                        name="beds"
                        defaultValue={1}
                        required
                        style={{ borderStyle: "none" }}
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div>
                      <label className="form-label text-white">Baths</label>
                      <input
                        className="form-control form-control"
                        type="number"
                        name="baths"
                        defaultValue={1}
                        required
                        style={{ borderStyle: "none" }}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="mt-3">
                      <label className="form-label text-white">
                        Property Value (Original)
                      </label>
                      <input
                        className="form-control form-control"
                        type="text"
                        required
                        style={{ borderStyle: "none" }}
                      />
                    </div>
                    <div className="mt-3">
                      <label className="form-label text-white">
                        MLS# (Optional)
                      </label>
                      <input
                        className="form-control form-control"
                        type="text"
                        required
                        style={{ borderStyle: "none" }}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-end my-3">
                  <button className="btn btn-primary ui-btn" type="submit">
                    Create Property
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

export default CreateProperty;
