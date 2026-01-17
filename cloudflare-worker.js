export default {
  async fetch(request, env) {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    try {
      // Parse the form data
      const data = await request.json();
      const { firstName, lastName, email, message, formType } = data;

      // Validate required fields
      if (!firstName || !lastName || !email || !message) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields' }),
          { 
            status: 400,
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          }
        );
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return new Response(
          JSON.stringify({ error: 'Invalid email address' }),
          { 
            status: 400,
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          }
        );
      }

      // Determine subject and content based on form type
      const isQuote = formType === 'quote';
      const subject = isQuote 
        ? `Quote Request from ${firstName} ${lastName}`
        : `New Contact Inquiry from ${firstName} ${lastName}`;

      const formTypeLabel = isQuote ? 'Quote Request' : 'Contact Form Inquiry';
      const formTypeColor = isQuote ? '#8C3820' : '#414759';

      // Professional HTML email template
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${formTypeLabel}</title>
  <!--[if !mso]><!--><div style="display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;">
    ${isQuote ? `New quote request from ${firstName} ${lastName} - Reply to ${email}` : `New contact inquiry from ${firstName} ${lastName} - Reply to ${email}`}
  </div><!--<![endif]-->
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f4f4;">
    <tr>
      <td align="center" style="padding: 40px 20px; font-size: 16px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, ${formTypeColor} 0%, #1e2a3a 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: 1px;">
                DESERT SPORTS MED
              </h1>
              <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px; opacity: 0.9; letter-spacing: 2px;">
                ${formTypeLabel.toUpperCase()}
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              
              <!-- Alert Badge -->
              <div style="background-color: ${formTypeColor}15; border-left: 4px solid ${formTypeColor}; padding: 15px 20px; margin-bottom: 30px; border-radius: 4px;">
                <p style="margin: 0; color: ${formTypeColor}; font-size: 14px; font-weight: 600;">
                  ${isQuote ? 'New Request:' : 'New Message:'}
                </p>
              </div>

              <!-- Contact Information -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 15px 0; border-bottom: 1px solid #e0e0e0;">
                    <table role="presentation" style="width: 100%;">
                      <tr>
                        <td style="width: 120px; vertical-align: top;">
                          <strong style="color: #555555; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Full Name</strong>
                        </td>
                        <td style="vertical-align: top;">
                          <span style="color: #222222; font-size: 15px; font-weight: 500;">${firstName} ${lastName}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px 0; border-bottom: 1px solid #e0e0e0;">
                    <table role="presentation" style="width: 100%;">
                      <tr>
                        <td style="width: 120px; vertical-align: top;">
                          <strong style="color: #555555; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Email</strong>
                        </td>
                        <td style="vertical-align: top;">
                          <span style="color: #222222; font-size: 15px; font-weight: 500;">${email}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px 0;">
                    <table role="presentation" style="width: 100%;">
                      <tr>
                        <td style="width: 120px; vertical-align: top;">
                          <strong style="color: #555555; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Submitted</strong>
                        </td>
                        <td style="vertical-align: top;">
                          <span style="color: #222222; font-size: 15px;">${new Date().toLocaleString('en-US', { 
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            timeZone: 'America/Denver',
                            timeZoneName: 'short'
                          })}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Message Section -->
              <div style="margin-bottom: 30px;">
                <h3 style="margin: 0 0 15px 0; color: #222222; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                  Message
                </h3>
                <div style="background-color: #f8f9fa; border-left: 4px solid ${formTypeColor}; padding: 20px; border-radius: 4px; line-height: 1.6;">
                  <p style="margin: 0; color: #333333; font-size: 15px; white-space: pre-wrap;">${message}</p>
                </div>
              </div>

              <!-- Action Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="mailto:${email}?subject=Re: ${isQuote ? 'Quote Request' : 'Contact Inquiry'}" 
                   style="display: inline-block; background-color: ${formTypeColor}; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 14px; letter-spacing: 1px; text-transform: uppercase; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  Reply to ${firstName}
                </a>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0 0 10px 0; color: #666666; font-size: 13px; line-height: 1.5;">
                This ${formTypeLabel.toLowerCase()} was submitted through the<br>
                <strong style="color: #222222;">Desert Sports Med</strong> website
              </p>
              <p style="margin: 10px 0 10px 0;">
                <a href="https://dsm-2p1.pages.dev" style="color: ${formTypeColor}; text-decoration: none; font-weight: 600;">
                  Visit Our Website
                </a>
              </p>
              <p style="margin: 10px 0 0 0; color: #999999; font-size: 12px;">
                © 2026 DESERT SPORTS MED. ALL RIGHTS RESERVED.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `;

      // Send email using Resend API
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Desert Sports Med <onboarding@resend.dev>',
          to: env.CONTACT_EMAIL,
          subject: subject,
          html: htmlContent,
        }),
      });

      if (!emailResponse.ok) {
        const errorData = await emailResponse.text();
        console.error('Resend API error:', errorData);
        throw new Error('Failed to send email');
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Email sent successfully' 
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );

    } catch (error) {
      console.error('Worker error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to process request',
          details: error.message 
        }),
        {
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
        }
      );
    }
  },
};
