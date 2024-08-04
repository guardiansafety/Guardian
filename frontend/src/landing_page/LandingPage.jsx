import TitleSection from './Title'; // Import the new VideoTitleSection component
import Footer from './Footer';
import BackgroundInfoSection from './BackgroundInfo';
import TimelineSection from './TimelineSection';

import FeaturesSection from './Features';
/*
import Testimonials from './Testimonials'; 
import ContactForm from './ContactUs';
import FAQAccordion from './FAQAccordion';
*/

const LandingPage = () => {
  return (
    <div>
      <TitleSection /> 
      <BackgroundInfoSection />
      <TimelineSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
