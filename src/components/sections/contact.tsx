/* Static React sections adapted from camxian.com. No WordPress runtime is used. */
import Link from "next/link";
import { ArrowIcon, Button } from "../button";
import { SocialIcon } from "../social-icon";
import { CustomerLogos, PartnerLogos } from "../logo-sections";
import { ContactForm } from "../contact-form";

export function ContactDetails() {
  return (
    <div className="elementor-element elementor-element-e339b1d e-flex e-con-boxed e-con e-parent">
      <div className="e-con-inner">
        <div className="elementor-element elementor-element-bd731e3 e-con-full elementor-hidden-tablet elementor-hidden-mobile e-flex e-con e-child">
          <div className="elementor-element elementor-element-38103cb elementor-widget__width-initial elementor-widget elementor-widget-image">
            <div className="elementor-widget-container">
              <img fetchPriority="high" decoding="async" width="1599" height="1508" src="/images/pexels-cottonbro-6803551@2x-1.jpg" alt="" srcSet="/images/pexels-cottonbro-6803551@2x-1.jpg 1599w, /images/pexels-cottonbro-6803551@2x-1-300x283.jpg 300w, /images/pexels-cottonbro-6803551@2x-1-1024x966.jpg 1024w, /images/pexels-cottonbro-6803551@2x-1-768x724.jpg 768w, /images/pexels-cottonbro-6803551@2x-1-1536x1449.jpg 1536w" sizes="(max-width: 1599px) 100vw, 1599px" />
            </div>
          </div>
          <div className="elementor-element elementor-element-35ddbfc elementor-widget__width-initial elementor-absolute elementor-hidden-desktop elementor-hidden-tablet elementor-hidden-mobile elementor-widget elementor-widget-image">
            <div className="elementor-widget-container">
              <img decoding="async" width="856" height="808" src="/images/blue-path@2x.jpg" alt="" srcSet="/images/blue-path@2x.jpg 856w, /images/blue-path@2x-300x283.jpg 300w, /images/blue-path@2x-768x725.jpg 768w" sizes="(max-width: 856px) 100vw, 856px" />
            </div>
          </div>
          <div className="elementor-element elementor-element-5acec39 elementor-widget__width-initial elementor-absolute elementor-widget elementor-widget-spacer">
            <div className="elementor-widget-container">
              <div className="elementor-spacer">
                <div className="elementor-spacer-inner">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="elementor-element elementor-element-3c40fa8 e-con-full e-flex e-con e-child">
          <div className="elementor-element elementor-element-1b91f9d elementor-widget__width-initial elementor-absolute elementor-widget elementor-widget-image">
            <div className="elementor-widget-container">
              <img decoding="async" width="1010" height="952" src="/images/gray-bg@2x.jpg" alt="" srcSet="/images/gray-bg@2x.jpg 1010w, /images/gray-bg@2x-300x283.jpg 300w, /images/gray-bg@2x-768x724.jpg 768w" sizes="(max-width: 1010px) 100vw, 1010px" />
            </div>
          </div>
          <div className="elementor-element elementor-element-1ad222c e-con-full e-flex e-con e-child">
            <div className="elementor-element elementor-element-f944b37 elementor-widget elementor-widget-heading">
              <div className="elementor-widget-container">
                <h1 className="elementor-heading-title elementor-size-default">
                  {"Contact us"}
                </h1>
              </div>
            </div>
            <div className="elementor-widget-container"><ContactForm /></div>
          </div>
          <div className="elementor-element elementor-element-48c91e1 e-con-full e-flex e-con e-child">
            <div className="elementor-element elementor-element-762b6df elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list">
              <div className="elementor-widget-container">
                <ul className="elementor-icon-list-items">
                  <li className="elementor-icon-list-item">
                    <span className="elementor-icon-list-icon">
                      <i aria-hidden="true" className="fas fa-address-book">
                      </i>
                    </span>
                    <span className="elementor-icon-list-text">
                      {"180 Dr. Sixto Ave. Bgy Caniogan, Pasig City, Metro Manila"}
                    </span>
                  </li>
                  <li className="elementor-icon-list-item">
                    <a href="tel:+63284623488">
                      <span className="elementor-icon-list-icon">
                        <i aria-hidden="true" className="fas fa-phone-alt">
                        </i>
                      </span>
                      <span className="elementor-icon-list-text">
                        {"+63 (28) 462-3488"}
                      </span>
                    </a>
                  </li>
                  <li className="elementor-icon-list-item">
                    <a href="mailto:info@camxian.com">
                      <span className="elementor-icon-list-icon">
                        <i aria-hidden="true" className="fas fa-envelope">
                        </i>
                      </span>
                      <span className="elementor-icon-list-text">
                        {"info@camxian.com"}
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Location() {
  return (
    <div className="elementor-element elementor-element-16eb30a e-flex e-con-boxed e-con e-parent">
      <div className="e-con-inner">
        <div className="elementor-element elementor-element-cb64d8d e-con-full e-flex e-con e-child">
          <div className="elementor-element elementor-element-e0dbba7 elementor-widget elementor-widget-heading">
            <div className="elementor-widget-container">
              <h3 className="elementor-heading-title elementor-size-default">
                {"Where to find us"}
              </h3>
            </div>
          </div>
          <div className="elementor-element elementor-element-dc9b780 elementor-widget elementor-widget-button">
            <div className="elementor-widget-container">
              <div className="elementor-button-wrapper">
                <Button href="https://maps.app.goo.gl/YYQsi2tg34to9gt17" target="_blank">
                  <span className="elementor-button-content-wrapper">
                    <span className="elementor-button-icon">
                      <ArrowIcon />
                    </span>
                    <span className="elementor-button-text">
                      {"Open in Google Maps"}
                    </span>
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="elementor-element elementor-element-871752f e-con-full e-flex e-con e-child">
          <div className="elementor-element elementor-element-c2a6cf5 elementor-widget elementor-widget-google_maps">
            <div className="elementor-widget-container">
              <div className="elementor-custom-embed">
                <iframe loading="lazy" src="https://maps.google.com/maps?q=camxian&t=m&z=16&output=embed&iwloc=near" title="Camxian Technologies location in Pasig City" aria-label="camxian">
                </iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
