import React from 'react'

const CreateMaintenanceRequest = () => {
  return (
    <div className="container-fluid">
    <div className="row mb-3">
      <div className="col-sm-12 col-md-8 col-lg-8 offset-sm-0 offset-md-2 offset-lg-2">
        <h3 className="text-white mb-4">Create A Maintenance Request</h3>
        <div className="card shadow mb-5">
          <div className="card-body">
            <div className="row" />
            <div className="row" />
            <div className="row">
              <div className="col-12">
                <form>
                  <div className="mb-3"><label className="form-label text-white" htmlFor="signature"><strong>Issue</strong><br /></label><textarea className="form-control" id="signature-1" rows={4} name="signature" style={{borderStyle: 'none'}} defaultValue={""} /></div>
                  <div className="mb-3" />
                  <div className="mb-3"><button className="btn btn-primary btn-sm ui-btn" type="submit">Submit</button></div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default CreateMaintenanceRequest