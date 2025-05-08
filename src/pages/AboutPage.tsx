import React from 'react';
import Page from '../components/layout/Page';

const AboutPage: React.FC = () => {
  return (
    <Page title="About">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">About FantasyByPro</h1>
        
        <div className="space-y-6 text-gray-600">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">What is FantasyByPro?</h2>
            <p className="mb-4">
              FantasyByPro is a comprehensive storyboard and project management tool designed specifically for creative professionals 
              working in animation, film, and digital media production. Our platform combines powerful storyboard creation tools 
              with efficient project management features to streamline your creative workflow.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Key Features</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Interactive Storyboard Creation:</strong> Create and edit storyboards with an intuitive interface
              </li>
              <li>
                <strong>Asset Management:</strong> Organize and manage all your creative assets in one place
              </li>
              <li>
                <strong>Task Management:</strong> Track project progress with our integrated task management system
              </li>
              <li>
                <strong>Team Collaboration:</strong> Work seamlessly with your team members in real-time
              </li>
              <li>
                <strong>Preview Capabilities:</strong> Preview your storyboards in sequence to visualize the final product
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
            <p className="mb-4">
              At FantasyByPro, we&apos;re dedicated to empowering creative professionals with tools that enhance their 
              productivity and creativity. We believe that the right tools can make a significant difference in 
              bringing creative visions to life.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Who is it for?</h2>
            <p className="mb-4">
              FantasyByPro is perfect for:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Animation studios and production houses</li>
              <li>Independent filmmakers and animators</li>
              <li>Creative directors and storyboard artists</li>
              <li>Project managers in creative industries</li>
              <li>Educational institutions teaching animation and film</li>
            </ul>
          </section>
        </div>
      </div>
    </Page>
  );
};

export default AboutPage; 