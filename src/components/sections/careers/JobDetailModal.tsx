import { X, ExternalLink, Briefcase, MapPin, Users, Clock } from 'lucide-react'

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
}

interface JobDetailModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

const JobDetailModal = ({ job, isOpen, onClose }: JobDetailModalProps) => {
  if (!isOpen || !job) return null

  const handleApplyClick = () => {
    const url = `https://recruitingbypaycor.com/career/JobIntroduction.action?clientId=8a7883d07ed6004a017f1cbf47b52a70&id=${job.id}&source=&lang=en`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  const handleIndeedApply = () => {
    // Indeed apply functionality - opens the job page where Indeed widget will be available
    handleApplyClick();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
          <div className="flex-1 pr-4">
            <h2 className="text-2xl font-bold text-primary-950 mb-2">{job.title}</h2>
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
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Full-time
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Job Description */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-primary-950 mb-4">Job Description</h3>
            <div className="prose max-w-none">
              {job.description ? (
                <div dangerouslySetInnerHTML={{ __html: job.description }} />
              ) : (
                <div className="space-y-4 text-gray-700">
                  <p>
                    Join our exceptional team at Birchwood Farms Golf & Country Club, where we are committed to providing outstanding service and maintaining the highest standards of hospitality in northern Michigan's premier private club setting.
                  </p>
                  <p>
                    We are seeking a dedicated professional for our <strong>{job.title}</strong> position in the <strong>{job.department}</strong> department. This seasonal position offers the opportunity to work in one of Michigan's most beautiful locations while being part of a team that values excellence and guest satisfaction.
                  </p>
                  
                  <h4 className="text-md font-semibold text-primary-900 mt-6 mb-2">Key Responsibilities:</h4>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Deliver exceptional service that exceeds guest expectations</li>
                    <li>Maintain high standards of quality and professionalism</li>
                    <li>Work collaboratively with team members to ensure smooth operations</li>
                    <li>Follow all safety protocols and club policies</li>
                    <li>Contribute to a positive work environment</li>
                  </ul>

                  <h4 className="text-md font-semibold text-primary-900 mt-6 mb-2">Qualifications:</h4>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Previous experience in hospitality or related field preferred</li>
                    <li>Strong communication and interpersonal skills</li>
                    <li>Ability to work in a fast-paced environment</li>
                    <li>Flexible schedule including weekends and holidays</li>
                    <li>Commitment to providing excellent customer service</li>
                  </ul>

                  <h4 className="text-md font-semibold text-primary-900 mt-6 mb-2">What We Offer:</h4>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Competitive compensation</li>
                    <li>Employee meals</li>
                    <li>Free golf privileges</li>
                    <li>Access to club facilities</li>
                    <li>Training and development opportunities</li>
                    <li>Work in a beautiful, prestigious environment</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Benefits Highlight */}
          <div className="bg-primary-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-primary-950 mb-3">Why Work at Birchwood?</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-primary-900 mb-1">Exceptional Environment</h4>
                <p className="text-gray-700">Work in one of northern Michigan's most beautiful and prestigious locations.</p>
              </div>
              <div>
                <h4 className="font-semibold text-primary-900 mb-1">Great Benefits</h4>
                <p className="text-gray-700">Enjoy employee meals, free golf, and access to club facilities.</p>
              </div>
              <div>
                <h4 className="font-semibold text-primary-900 mb-1">Team Excellence</h4>
                <p className="text-gray-700">Join a team committed to providing world-class hospitality.</p>
              </div>
            </div>
          </div>

          {/* Application Buttons */}
          <div className="border-t pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleApplyClick}
                className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center font-medium"
              >
                Apply Now
                <ExternalLink className="w-4 h-4 ml-2" />
              </button>
              <button
                onClick={handleIndeedApply}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center font-medium"
              >
                Apply with Indeed
                <ExternalLink className="w-4 h-4 ml-2" />
              </button>
            </div>
            <p className="text-sm text-gray-500 text-center mt-3">
              Applications are processed through our secure external portal
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobDetailModal
