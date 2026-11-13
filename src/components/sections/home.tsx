/* Static React sections adapted from camxian.com. No WordPress runtime is used. */
import Link from "next/link";
import { ArrowIcon, Button } from "../button";
import { SocialIcon } from "../social-icon";
import { CustomerLogos, PartnerLogos } from "../logo-sections";

export function HomeHero() {
  return (
    <div className="elementor-element elementor-element-9876f01 e-con-full e-flex e-con e-parent">
      <div className="elementor-element elementor-element-ecc5fd5 e-con-full e-flex e-con e-child">
        <div className="elementor-element elementor-element-daa559e elementor-widget-mobile__width-initial elementor-widget elementor-widget-heading">
          <div className="elementor-widget-container">
            <h1 className="elementor-heading-title elementor-size-default">
              {"Technology that will "}
              <br />
              {"shape your future"}
            </h1>
          </div>
        </div>
        <div className="elementor-element elementor-element-e8cff93 elementor-widget-tablet__width-initial elementor-widget elementor-widget-text-editor">
          <div className="elementor-widget-container">
            {" Empowering innovation and security today for a safer tomorrow! "}
          </div>
        </div>
        <div className="elementor-element elementor-element-2cb2e3d elementor-mobile-align-center elementor-widget elementor-widget-button">
          <div className="elementor-widget-container">
            <div className="elementor-button-wrapper">
              <Button href="/contact/">
                <span className="elementor-button-content-wrapper">
                  <span className="elementor-button-icon">
                    <ArrowIcon />
                  </span>
                  <span className="elementor-button-text">
                    {"Talk to an expert now!"}
                  </span>
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="elementor-element elementor-element-1956a6e e-con-full e-flex e-con e-child">
        <div className="elementor-element elementor-element-78b290d elementor-widget__width-initial elementor-absolute elementor-widget elementor-widget-image">
          <div className="elementor-widget-container">
            <img fetchPriority="high" decoding="async" width="856" height="808" src="/images/blue-path@2x.jpg" alt="" srcSet="/images/blue-path@2x.jpg 856w, /images/blue-path@2x-300x283.jpg 300w, /images/blue-path@2x-768x725.jpg 768w" sizes="(max-width: 856px) 100vw, 856px" />
          </div>
        </div>
        <div className="elementor-element elementor-element-564379b elementor-widget__width-initial elementor-absolute elementor-widget elementor-widget-image">
          <div className="elementor-widget-container">
            <img decoding="async" width="916" height="864" src="/images/Path-237@2x.jpg" alt="" srcSet="/images/Path-237@2x.jpg 916w, /images/Path-237@2x-300x283.jpg 300w, /images/Path-237@2x-768x724.jpg 768w" sizes="(max-width: 916px) 100vw, 916px" />
          </div>
        </div>
        <div className="elementor-element elementor-element-585c63f elementor-widget elementor-widget-image">
          <div className="elementor-widget-container">
            <img decoding="async" width="987" height="694" src="/images/banner-image@2x.png" alt="Technology and communications solutions" srcSet="/images/banner-image@2x.png 987w, /images/banner-image@2x-300x211.png 300w, /images/banner-image@2x-768x540.png 768w" sizes="(max-width: 987px) 100vw, 987px" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function HomeAbout() {
  return (
    <div className="elementor-element elementor-element-e91a070 e-flex e-con-boxed e-con e-parent">
      <div className="e-con-inner">
        <div className="elementor-element elementor-element-90c85b8 e-con-full e-flex e-con e-child">
          <div className="elementor-element elementor-element-213ac7c elementor-widget elementor-widget-image">
            <div className="elementor-widget-container">
              <img loading="lazy" decoding="async" width="1122" height="564" src="/images/Logo-Portrait@2x.png" alt="Camxian Technologies — Security, Telecom and IT solutions" srcSet="/images/Logo-Portrait@2x.png 1122w, /images/Logo-Portrait@2x-300x151.png 300w, /images/Logo-Portrait@2x-1024x515.png 1024w, /images/Logo-Portrait@2x-768x386.png 768w" sizes="(max-width: 1122px) 100vw, 1122px" />
            </div>
          </div>
        </div>
        <div className="elementor-element elementor-element-bedded5 e-con-full e-flex e-con e-child">
          <div className="elementor-element elementor-element-5021beb elementor-widget elementor-widget-heading">
            <div className="elementor-widget-container">
              <h2 className="elementor-heading-title elementor-size-default">
                {"About Us"}
              </h2>
            </div>
          </div>
          <div className="elementor-element elementor-element-febfe17 elementor-widget elementor-widget-text-editor">
            <div className="elementor-widget-container">
              <p>
                {"Our company specializes in Security, Telecom, and IT solutions. We aim to advance societal adaptation to the latest technology trends and contribute to nation-building and technological transformation."}
              </p>
            </div>
          </div>
          <div className="elementor-element elementor-element-40f2430 elementor-mobile-align-center elementor-widget elementor-widget-button">
            <div className="elementor-widget-container">
              <div className="elementor-button-wrapper">
                <Button href="/contact/">
                  <span className="elementor-button-content-wrapper">
                    <span className="elementor-button-icon">
                      <ArrowIcon />
                    </span>
                    <span className="elementor-button-text">
                      {"Contact Us"}
                    </span>
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Expertise() {
  return (
    <div className="elementor-element elementor-element-861e654 e-flex e-con-boxed e-con e-parent">
      <div className="e-con-inner">
        <div className="elementor-element elementor-element-9febd0f e-con-full e-flex e-con e-child">
          <div className="elementor-element elementor-element-158fc68 elementor-widget elementor-widget-heading">
            <div className="elementor-widget-container">
              <h2 className="elementor-heading-title elementor-size-default">
                {"Our Expertise"}
              </h2>
            </div>
          </div>
        </div>
        <div className="elementor-element elementor-element-965f720 e-con-full e-flex e-con e-child">
          <div className="elementor-element elementor-element-d901ab6 e-con-full e-flex e-con e-child">
            <div className="elementor-element elementor-element-b3bbef6 elementor-widget elementor-widget-image">
              <div className="elementor-widget-container">
                <img loading="lazy" decoding="async" width="211" height="219" src="/images/icon-security@2x.png" alt="" />
              </div>
            </div>
            <div className="elementor-element elementor-element-6f61d73 elementor-widget elementor-widget-heading">
              <div className="elementor-widget-container">
                <h4 className="elementor-heading-title elementor-size-default">
                  {"Security"}
                </h4>
              </div>
            </div>
            <div className="elementor-element elementor-element-0d2cd4f elementor-widget elementor-widget-text-editor">
              <div className="elementor-widget-container">
                <p>
                  {"From high-tech surveillance to seamless access control, we deliver and install comprehensive security solutions to keep your business safe"}
                  <br />
                  {"and secure."}
                </p>
              </div>
            </div>
          </div>
          <div className="elementor-element elementor-element-a6b2ee4 e-con-full e-flex e-con e-child">
            <div className="elementor-element elementor-element-0016469 elementor-widget elementor-widget-image">
              <div className="elementor-widget-container">
                <img loading="lazy" decoding="async" width="211" height="219" src="/images/icon-telecom@2x.png" alt="" />
              </div>
            </div>
            <div className="elementor-element elementor-element-91ec766 elementor-widget elementor-widget-heading">
              <div className="elementor-widget-container">
                <h4 className="elementor-heading-title elementor-size-default">
                  {"Telecom"}
                </h4>
              </div>
            </div>
            <div className="elementor-element elementor-element-3ef50b5 elementor-widget elementor-widget-text-editor">
              <div className="elementor-widget-container">
                <p>
                  {"We deliver a secure, reliable, and high-speed data and voice connection for your business through network and WiFi access points, and more."}
                </p>
              </div>
            </div>
          </div>
          <div className="elementor-element elementor-element-6eed0b5 e-con-full e-flex e-con e-child">
            <div className="elementor-element elementor-element-c5faca1 elementor-widget elementor-widget-image">
              <div className="elementor-widget-container">
                <img loading="lazy" decoding="async" width="211" height="219" src="/images/icon-it-business@2x.png" alt="" />
              </div>
            </div>
            <div className="elementor-element elementor-element-d2ca28f elementor-widget elementor-widget-heading">
              <div className="elementor-widget-container">
                <h4 className="elementor-heading-title elementor-size-default">
                  {"I.T & Business Solutions"}
                </h4>
              </div>
            </div>
            <div className="elementor-element elementor-element-bb209f5 elementor-widget elementor-widget-text-editor">
              <div className="elementor-widget-container">
                <p>
                  {"From high-tech surveillance to seamless access control, we deliver and install comprehensive security solutions to keep your business safe and secure."}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="elementor-element elementor-element-b74ab8b elementor-widget elementor-widget-button">
          <div className="elementor-widget-container">
            <div className="elementor-button-wrapper">
              <Button href="/product-services/">
                <span className="elementor-button-content-wrapper">
                  <span className="elementor-button-icon">
                    <ArrowIcon />
                  </span>
                  <span className="elementor-button-text">
                    {"Learn More"}
                  </span>
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Customers() {
  return (
    <div className="elementor-element elementor-element-ad4cb5d e-flex e-con-boxed e-con e-parent">
      <div className="e-con-inner">
        <div className="elementor-element elementor-element-a709f63 e-con-full e-flex e-con e-child">
          <div className="elementor-element elementor-element-9796f70 elementor-widget elementor-widget-template">
            <div className="elementor-widget-container">
              <div className="elementor-template">
                <CustomerLogos />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Partners() {
  return (
    <div className="elementor-element elementor-element-efeb8ec e-flex e-con-boxed e-con e-parent">
      <div className="e-con-inner">
        <div className="elementor-element elementor-element-6557962 elementor-widget elementor-widget-template">
          <div className="elementor-widget-container">
            <div className="elementor-template">
              <PartnerLogos />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FutureReady() {
  return (
    <div className="elementor-element elementor-element-606de44 e-flex e-con-boxed e-con e-parent">
      <div className="e-con-inner">
        <div className="elementor-element elementor-element-a7d8689 e-con-full e-flex e-con e-child">
          <div className="elementor-element elementor-element-ba60156 elementor-widget__width-initial elementor-absolute elementor-hidden-mobile elementor-widget elementor-widget-image">
            <div className="elementor-widget-container">
              <img loading="lazy" decoding="async" width="1235" height="1165" src="/images/shenzhen-2023-11-27-05-35-33-utc@2x.jpg" alt="" srcSet="/images/shenzhen-2023-11-27-05-35-33-utc@2x.jpg 1235w, /images/shenzhen-2023-11-27-05-35-33-utc@2x-300x283.jpg 300w, /images/shenzhen-2023-11-27-05-35-33-utc@2x-1024x966.jpg 1024w, /images/shenzhen-2023-11-27-05-35-33-utc@2x-768x724.jpg 768w" sizes="(max-width: 1235px) 100vw, 1235px" />
            </div>
          </div>
          <div className="elementor-element elementor-element-ca427b6 elementor-widget__width-initial elementor-absolute elementor-hidden-mobile elementor-widget elementor-widget-image">
            <div className="elementor-widget-container">
              <img loading="lazy" decoding="async" width="490" height="462" src="/images/Path-238@2x.jpg" alt="" srcSet="/images/Path-238@2x.jpg 490w, /images/Path-238@2x-300x283.jpg 300w" sizes="(max-width: 490px) 100vw, 490px" />
            </div>
          </div>
          <div className="elementor-element elementor-element-4978cd2 e-con-full e-flex e-con e-child">
            <div className="elementor-element elementor-element-269dc18 elementor-widget elementor-widget-heading">
              <div className="elementor-widget-container">
                <h2 className="elementor-heading-title elementor-size-default">
                  {"Make your business future-ready today"}
                </h2>
              </div>
            </div>
            <div className="elementor-element elementor-element-688ff55 elementor-widget__width-initial elementor-widget elementor-widget-text-editor">
              <div className="elementor-widget-container">
                <p>
                  {"Let us help you reinforce your Security, Business Operation and Network Infrastructure so you can streamline your business for tomorrow."}
                </p>
              </div>
            </div>
            <div className="elementor-element elementor-element-f1f1028 elementor-mobile-align-center elementor-widget elementor-widget-button">
              <div className="elementor-widget-container">
                <div className="elementor-button-wrapper">
                  <Button href="/contact/">
                    <span className="elementor-button-content-wrapper">
                      <span className="elementor-button-icon">
                        <ArrowIcon />
                      </span>
                      <span className="elementor-button-text">
                        {"Contact us"}
                      </span>
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="elementor-element elementor-element-e437a71 e-con-full e-flex e-con e-child">
          </div>
        </div>
      </div>
    </div>
  );
}
