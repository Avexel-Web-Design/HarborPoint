import { useState, useEffect } from 'react'
import { ExternalLink, Briefcase, Users, MapPin } from 'lucide-react'
import JobDetailModal from './JobDetailModal'

const CareersApplications = () => {
  const [selectedJob, setSelectedJob] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const [currentJobs] = useState([
    {
      title: "Concessions Cook",
      department: "Food & Beverage",
      location: "Harbor Springs, MI",
      type: "Seasonal",
      id: "8a7883ac96d0a138019722e1917716e3"
    },
    {
      title: "Bartenders",
      department: "Food & Beverage", 
      location: "Harbor Springs, MI",
      type: "Seasonal",
      id: "8a7887a195f854620196398108006dda"
    },
    {
      title: "Servers",
      department: "Food & Beverage",
      location: "Harbor Springs, MI", 
      type: "Seasonal",
      id: "8a78879e973cdb67019745521d43005f"
    },
    {
      title: "Valet Drivers",
      department: "Guest Services",
      location: "Harbor Springs, MI",
      type: "Seasonal",
      id: "8a78859e96888d2f0196ac3dbfd87ab1"
    },
    {
      title: "Golf Course Greens Mower",
      department: "Golf Maintenance",
      location: "Harbor Springs, MI",
      type: "Seasonal",
      id: "8a7887ac96d0a18001973768bc74226c"
    },
    {
      title: "Banquet Chef",
      department: "Kitchen",
      location: "Harbor Springs, MI",
      type: "Seasonal",
      id: "8a78879e974d4ce101975f1549ed56b5"
    },
    {
      title: "Dishwashers",
      department: "Kitchen",
      location: "Harbor Springs, MI",
      type: "Seasonal",
      id: "8a78879e96888d480196b6daa2cf07d0"
    },
    {
      title: "Food Expeditor",
      department: "Kitchen",
      location: "Harbor Springs, MI",
      type: "Seasonal",
      id: "8a78879e974d4ce10197608666800cbc"
    },
    {
      title: "Line Cooks", 
      department: "Kitchen",
      location: "Harbor Springs, MI",
      type: "Seasonal",
      id: "8a78879e974d4ce10197603e7deb6f1e"    }
  ])

  const handleJobClick = (job) => {
    setSelectedJob(job)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedJob(null)
  }

  const handleApplyClick = (jobId = null) => {
    let url = 'https://recruitingbypaycor.com/career/CareerHome.action?clientId=8a7883d07ed6004a017f1cbf47b52a70';
    
    if (jobId) {
      url = `https://recruitingbypaycor.com/career/JobIntroduction.action?clientId=8a7883d07ed6004a017f1cbf47b52a70&id=${jobId}&source=&lang=en`;
    }
    
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <section id="careers-applications" className="py-20 bg-gray-50">
      <div className="container-width section-padding">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold font-serif text-primary-950 mb-6">
            Current Job Openings
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Explore our current job opportunities and apply directly through our secure online application system. 
            We're always looking for passionate individuals to join our team.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Job Listings */}          <div className="grid gap-4 mb-8">
            {currentJobs.map((job, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div className="flex-1 mb-4 md:mb-0">
                      <h3 className="text-xl font-semibold text-primary-950 mb-2">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-1" />
                          {job.department}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {job.type}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => handleApplyClick(job.id)}
                      className="btn-primary flex items-center justify-center flex-1"
                    >
                      View Details & Apply
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </button>
                    <button
                      onClick={() => handleApplyClick(job.id)}
                      className="btn-secondary flex items-center justify-center whitespace-nowrap"
                    >
                      Quick Apply
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Apply Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <Briefcase className="w-16 h-16 text-primary-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold font-serif text-primary-950 mb-3">
                Ready to Apply?
              </h3>
              <p className="text-gray-700 mb-6">
                Click below to access our secure online application system where you can view detailed job descriptions, 
                submit your application, and upload your resume.
              </p>
            </div>
              <button
              onClick={() => handleApplyClick()}
              className="btn-primary text-lg px-8 py-4 flex items-center justify-center mx-auto"
            >
              Browse All Positions
              <ExternalLink className="w-5 h-5 ml-3" />
            </button>
            
            <p className="text-sm text-gray-500 mt-4">
              Opens in a new secure window powered by Paycor
            </p>
          </div>          {/* Additional info */}
          <div className="mt-8">
            <div className="bg-primary-50 p-6 rounded-lg">
              <h4 className="text-xl font-semibold text-primary-950 mb-3">
                Don't See What You're Looking For?
              </h4>
              <p className="text-gray-700 mb-4">
                We're always interested in hearing from talented individuals, even if we don't have a current opening that matches your skills. 
                You can submit your resume for future consideration through our application system.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">                <button
                  onClick={() => handleApplyClick()}
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-300"
                >
                  Submit Resume for Future Opportunities
                  <ExternalLink className="w-4 h-4 ml-2" />
                </button>
                <a 
                  href="mailto:brooke@birchwoodcc.com"
                  className="inline-flex items-center justify-center px-6 py-3 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors duration-300"
                >
                  Contact HR Directly
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CareersApplications
