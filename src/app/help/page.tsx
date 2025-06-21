import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HeroWave from "@/components/ui/dynamic-wave-canvas-background"; // Import the new background component
import { SimpleNavbar } from "@/components/simple-navbar"; // Add this import
import { Footer } from "@/components/footer"; // Add this import

const HelpPage = () => {
  return (
    <div className="min-h-screen bg-background"> {/* New main container */}
      <SimpleNavbar /> {/* Add Navbar */}

      {/* Original content container with background */}
      <div className="relative min-h-screen overflow-hidden">
        <HeroWave /> {/* Background */}

        {/* Content container */}
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-10 text-center text-gray-900 dark:text-white">Help & Support</h1>

          {/* FAQs Section */}
          <Card className="mb-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">Frequently Asked Questions (FAQs)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* FAQ Item 1 */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Q: How do I upload photos?</h3>
                <p className="text-gray-700 dark:text-gray-300">A: To upload photos, navigate to the &quot;Upload&quot; section from your dashboard. You can either click on the designated upload area to browse files on your device or simply drag and drop your photos directly into the area. Before finalizing the upload, you&apos;ll have the option to select an existing vault or create a new one to keep your memories organized. Supported file types include JPG, PNG, and GIF.</p>
              </div>
              {/* FAQ Item 2 */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Q: Can I share my vaults with family members?</h3>
                <p className="text-gray-700 dark:text-gray-300">A: Absolutely! To share a vault, go to the specific vault you wish to share. Look for the &quot;Share&quot; or &quot;Invite Members&quot; option. You can then invite other users by their email address. You can also set different permission levels, such as view-only or contribute access, allowing them to either just see the photos or add their own.</p>
              </div>
              {/* FAQ Item 3 */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Q: What if I forget my password?</h3>
                <p className="text-gray-700 dark:text-gray-300">A: If you forget your password, simply go to the login page and click on the &quot;Forgot Password&quot; link. Enter the email address associated with your account, and we will send you a secure link to reset your password. Please check your spam folder if you don&apos;t receive the email within a few minutes.</p>
              </div>
              {/* FAQ Item 4 */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Q: How do I contact support?</h3>
                <p className="text-gray-700 dark:text-gray-300">A: If you can&apos;t find an answer to your question in our FAQs, our support team is here to help! You can reach us directly via email at the address provided below. We strive to respond to all inquiries within 24-48 business hours. For urgent matters, please mark your email as high priority.</p>
              </div>
              {/* New FAQ Item 5 */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Q: How can I organize my photos effectively?</h3>
                <p className="text-gray-700 dark:text-gray-300">A: We recommend utilizing vaults to categorize your photos. You can create vaults for different events, years, or family branches. Additionally, you can add titles and descriptions to individual photos to make them easily searchable. Consider using a consistent naming convention for your vaults and photos.</p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Support Section */}
          <Card className="text-center bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">Contact Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-800 dark:text-gray-200 mb-4">For further assistance, please email us at:</p>
              <p className="text-2xl font-bold text-violet-600 dark:text-violet-400 hover:underline">
                <a href="mailto:itisaddy7@gmail.com">itisaddy7@gmail.com</a>
              </p>
              <p className="text-gray-600 dark:text-gray-400 mt-4">We aim to respond to all inquiries within 24-48 hours. Please include as much detail as possible regarding your issue to help us assist you more efficiently.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer /> {/* Add Footer */}
    </div>
  );
};

export default HelpPage;