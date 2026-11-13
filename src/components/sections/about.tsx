/* Static React sections adapted from camxian.com. No WordPress runtime is used. */
import Link from "next/link";
import { ArrowIcon, Button } from "../button";
import { SocialIcon } from "../social-icon";
import { CustomerLogos, PartnerLogos } from "../logo-sections";
import { MilestoneCarousel } from "../milestone-carousel";

export function AboutHero() {
  return (
    <div className="elementor-element elementor-element-f49aabb e-flex e-con-boxed e-con e-parent">
      <div className="e-con-inner">
        <div className="elementor-element elementor-element-2084c98 elementor-widget__width-initial elementor-widget elementor-widget-heading">
          <div className="elementor-widget-container">
            <h1 className="elementor-heading-title elementor-size-default">
              {"Leading the Transformation in Security, IT, and Telecom"}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CompanyIntroduction() {
  return (
    <div className="elementor-element elementor-element-663a206 e-flex e-con-boxed e-con e-parent">
      <div className="e-con-inner">
        <div className="elementor-element elementor-element-df7c7f2 e-con-full e-flex e-con e-child">
          <div className="elementor-element elementor-element-4b0913e elementor-widget elementor-widget-image">
            <div className="elementor-widget-container">
              <img fetchPriority="high" decoding="async" width="1257" height="1186" src="/images/about-image@2x.jpg" alt="Camxian technology experts" srcSet="/images/about-image@2x.jpg 1257w, /images/about-image@2x-300x283.jpg 300w, /images/about-image@2x-1024x966.jpg 1024w, /images/about-image@2x-768x725.jpg 768w" sizes="(max-width: 1257px) 100vw, 1257px" />
            </div>
          </div>
          <div className="elementor-element elementor-element-547a71c elementor-widget__width-initial elementor-absolute elementor-widget elementor-widget-image">
            <div className="elementor-widget-container">
              <img decoding="async" width="490" height="462" src="/images/Path-238@2x.jpg" alt="" srcSet="/images/Path-238@2x.jpg 490w, /images/Path-238@2x-300x283.jpg 300w" sizes="(max-width: 490px) 100vw, 490px" />
            </div>
          </div>
        </div>
        <div className="elementor-element elementor-element-185d4db e-con-full e-flex e-con e-child">
          <div className="elementor-element elementor-element-835e1e1 elementor-widget elementor-widget-heading">
            <div className="elementor-widget-container">
              <h5 className="elementor-heading-title elementor-size-default">
                {"About Us"}
              </h5>
            </div>
          </div>
          <div className="elementor-element elementor-element-2680c77 elementor-widget elementor-widget-heading">
            <div className="elementor-widget-container">
              <h2 className="elementor-heading-title elementor-size-default">
                {"Your Reliable "}
                <br />
                {"Technology Expert "}
              </h2>
            </div>
          </div>
          <div className="elementor-element elementor-element-ff2c6da elementor-widget__width-initial elementor-widget-tablet__width-inherit elementor-widget elementor-widget-text-editor">
            <div className="elementor-widget-container">
              <p>
                {"Founded on April 12, 2019, CAMXIAN is a dynamic organization specializing in cutting-edge security, telecom, and IT solutions. Our mission extends beyond establishing our brand, as we are driven by a commitment to contribute to our societal adaptation to the latest technological trends and play a vital role in nation-building and technological transformation."}
              </p>
              <p>
                {"In response to rapid technological advancements, the demand for "}
                <br />
                {"top-notch security, telecom, and IT solutions has become a fundamental necessity, enhancing the quality of our daily lives. CAMXIAN acknowledges this need and has positioned itself as a foremost and rapidly expanding provider of comprehensive solutions in these critical domains."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CompanyHistory() {
  return (
    <div className="elementor-element elementor-element-8e98140 e-flex e-con-boxed e-con e-parent">
      <div className="e-con-inner">
        <div className="elementor-element elementor-element-f224722 elementor-widget elementor-widget-image">
          <div className="elementor-widget-container">
            <img decoding="async" width="2148" height="980" src="/images/camxian-images@2x.jpg" alt="Camxian milestones and community activities" srcSet="/images/camxian-images@2x.jpg 2148w, /images/camxian-images@2x-300x137.jpg 300w, /images/camxian-images@2x-1024x467.jpg 1024w, /images/camxian-images@2x-768x350.jpg 768w, /images/camxian-images@2x-1536x701.jpg 1536w, /images/camxian-images@2x-2048x934.jpg 2048w" sizes="(max-width: 2148px) 100vw, 2148px" />
          </div>
        </div>
        <div className="elementor-element elementor-element-25ea74a elementor-widget elementor-widget-text-editor">
          <div className="elementor-widget-container">
            <p>
              {"Over the years, CAMXIAN has successfully catered to the needs of over 30,000 households and more than 300 MSMEs and SMEs, ensuring the provision of top-tier products and services. In addition to our business endeavors, our company takes pride in initiating various outreach programs, embodying our commitment to giving back to society. At CAMXIAN, our vision goes beyond meeting the technological demands of today; we strive to create lasting impacts on the community and contribute meaningfully to the ever-evolving landscape of technology."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Milestones() {
  return (
    <div className="elementor-element elementor-element-b287346 e-flex e-con-boxed e-con e-parent">
      <div className="e-con-inner">
        <div className="elementor-element elementor-element-c0fb562 elementor-widget elementor-widget-heading">
          <div className="elementor-widget-container">
            <h2 className="elementor-heading-title elementor-size-default">
              {"Our Milestones"}
            </h2>
          </div>
        </div>
        <div className="elementor-element elementor-element-8985bb0 e-con-full elementor-hidden-desktop elementor-hidden-tablet elementor-hidden-mobile e-flex e-con e-child">
          <div className="elementor-element elementor-element-d2d0365 e-con-full e-flex e-con e-child">
            <div className="elementor-element elementor-element-aad9828 e-con-full e-flex e-con e-child">
              <div className="elementor-element elementor-element-5cce386 e-con-full top-e-heights e-flex e-con e-child">
                <div className="elementor-element elementor-element-1592de9 elementor-widget elementor-widget-text-editor">
                  <div className="elementor-widget-container">
                    <p>
                      {"Our company started as a small venture on April 12, 2019, with zero monetary capital during the "}
                      <strong>
                        {"lockdown pandemic"}
                      </strong>
                      {"."}
                    </p>
                  </div>
                </div>
                <div className="elementor-element elementor-element-36328f4 elementor-widget elementor-widget-heading">
                  <div className="elementor-widget-container">
                    <h6 className="elementor-heading-title elementor-size-default">
                      {"2019"}
                    </h6>
                  </div>
                </div>
              </div>
              <div className="elementor-element elementor-element-13e72a6 e-con-full bottom-e-heights e-flex e-con e-child">
              </div>
            </div>
            <div className="elementor-element elementor-element-36fc540 e-con-full e-flex e-con e-child">
              <div className="elementor-element elementor-element-8a3c0d9 e-con-full top-e-heights e-flex e-con e-child">
              </div>
              <div className="elementor-element elementor-element-0266f25 e-con-full bottom-e-heights e-flex e-con e-child">
                <div className="elementor-element elementor-element-a50da0c elementor-widget elementor-widget-heading">
                  <div className="elementor-widget-container">
                    <h6 className="elementor-heading-title elementor-size-default">
                      {"2020"}
                    </h6>
                  </div>
                </div>
                <div className="elementor-element elementor-element-0e668b5 elementor-widget elementor-widget-text-editor">
                  <div className="elementor-widget-container">
                    <p>
                      {"In just a short span of time, PLDT Enterprise acknowledged us and formed a partnership with us to extend their market reach to MSME and SME clients."}
                    </p>
                    <p>
                      {"Within the year, we were able to help "}
                      <strong>
                        {"80+ MSMEs and SMEs"}
                      </strong>
                      {" by providing them with reliable internet and voice, security, and other IT solutions."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="elementor-element elementor-element-a35a424 e-con-full e-flex e-con e-child">
              <div className="elementor-element elementor-element-eb9867e e-con-full top-e-heights e-flex e-con e-child">
                <div className="elementor-element elementor-element-0c89468 elementor-widget elementor-widget-text-editor">
                  <div className="elementor-widget-container">
                    <p>
                      {"PLDT Home formed a partnership with us to extend our market to households."}
                    </p>
                    <p>
                      {"Within the year, we were able to help "}
                      <strong>
                        {"5,000+ Households, including 100+ MSMEs and SMEs"}
                      </strong>
                      {", with their internet, security, and other IT requirements."}
                    </p>
                  </div>
                </div>
                <div className="elementor-element elementor-element-fed5f63 elementor-widget elementor-widget-heading">
                  <div className="elementor-widget-container">
                    <h6 className="elementor-heading-title elementor-size-default">
                      {"2021"}
                    </h6>
                  </div>
                </div>
              </div>
              <div className="elementor-element elementor-element-c9567e7 e-con-full bottom-e-heights e-flex e-con e-child">
              </div>
            </div>
            <div className="elementor-element elementor-element-9f5f50d e-con-full e-flex e-con e-child">
              <div className="elementor-element elementor-element-85daa18 e-con-full top-e-heights e-flex e-con e-child">
              </div>
              <div className="elementor-element elementor-element-181a534 e-con-full bottom-e-heights e-flex e-con e-child">
                <div className="elementor-element elementor-element-7f1d68e elementor-widget elementor-widget-heading">
                  <div className="elementor-widget-container">
                    <h6 className="elementor-heading-title elementor-size-default">
                      {"2021-2022"}
                    </h6>
                  </div>
                </div>
                <div className="elementor-element elementor-element-7c40a63 elementor-widget elementor-widget-text-editor">
                  <div className="elementor-widget-container">
                    <p>
                      {"With our notable contributions to the IT and Telecom industry, we received prestigious awards and recognition from a well-known company such as PLDT."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="elementor-element elementor-element-45fa345 e-con-full e-flex e-con e-child">
              <div className="elementor-element elementor-element-b802ced e-con-full top-e-heights e-flex e-con e-child">
                <div className="elementor-element elementor-element-94617ad elementor-widget elementor-widget-text-editor">
                  <div className="elementor-widget-container">
                    <p>
                      {"To give back to the community, we shared the blessings we received through our organization by providing those without livelihood an opportunity to earn."}
                    </p>
                    <p>
                      {"In the same year, our agent network grew from 0 to "}
                      <strong>
                        {"50+ active partners nationwide"}
                      </strong>
                      {"."}
                    </p>
                  </div>
                </div>
                <div className="elementor-element elementor-element-74dc48b elementor-widget elementor-widget-heading">
                  <div className="elementor-widget-container">
                    <h6 className="elementor-heading-title elementor-size-default">
                      {"2022"}
                    </h6>
                  </div>
                </div>
              </div>
              <div className="elementor-element elementor-element-542c176 e-con-full bottom-e-heights e-flex e-con e-child">
              </div>
            </div>
            <div className="elementor-element elementor-element-987943c e-con-full e-flex e-con e-child">
              <div className="elementor-element elementor-element-f92d39a e-con-full top-e-heights e-flex e-con e-child">
              </div>
              <div className="elementor-element elementor-element-8726989 e-con-full bottom-e-heights e-flex e-con e-child">
                <div className="elementor-element elementor-element-747143f elementor-widget elementor-widget-heading">
                  <div className="elementor-widget-container">
                    <h6 className="elementor-heading-title elementor-size-default">
                      {"2023"}
                    </h6>
                  </div>
                </div>
                <div className="elementor-element elementor-element-c650498 elementor-widget elementor-widget-text-editor">
                  <div className="elementor-widget-container">
                    <p>
                      {"As lockdowns were lifted, we decided to move from a virtual setup to a physical office, and permanently hire employees."}
                    </p>
                    <p>
                      {"By the end of the year, we were able to serve "}
                      <strong>
                        {"28,000+ Households and 300+ SMEs, MSMEs, and Government Nationwide"}
                      </strong>
                      {". We also have "}
                      <strong>
                        {"80+ active partners, team sales leaders, and agents"}
                      </strong>
                      {", continuously growing."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="elementor-element elementor-element-3b72517 e-con-full e-flex e-con e-child">
              <div className="elementor-element elementor-element-ab8c689 e-con-full top-e-heights e-flex e-con e-child">
                <div className="elementor-element elementor-element-eebadaf elementor-widget elementor-widget-text-editor">
                  <div className="elementor-widget-container">
                    <p>
                      {"As of date, we already serve "}
                      <strong>
                        {"+30,000 Households nationwide"}
                      </strong>
                      {". We also received awards and recognition early this year from reputable partners and organizations."}
                    </p>
                  </div>
                </div>
                <div className="elementor-element elementor-element-42513a0 elementor-widget elementor-widget-heading">
                  <div className="elementor-widget-container">
                    <h6 className="elementor-heading-title elementor-size-default">
                      {"2024"}
                    </h6>
                  </div>
                </div>
              </div>
              <div className="elementor-element elementor-element-66da359 e-con-full bottom-e-heights e-flex e-con e-child">
              </div>
            </div>
          </div>
        </div>
        <div className="elementor-element elementor-element-48f3937 e-con-full e-flex e-con e-child">
          <div className="elementor-element elementor-element-63498e3 elementor-pagination-type-bullets elementor-pagination-position-outside elementor-widget elementor-widget-n-carousel">
            <div className="elementor-widget-container">
              <MilestoneCarousel>
                <div className="swiper-slide" role="group" aria-roledescription="slide" aria-label="1 of 7">
                  <div className="elementor-element elementor-element-37784fd e-flex e-con-boxed e-con e-child">
                    <div className="e-con-inner">
                      <div className="elementor-element elementor-element-ffa6717 e-con-full e-flex e-con e-child">
                        <div className="elementor-element elementor-element-da4875c e-con-full top-e-heights e-flex e-con e-child">
                          <div className="elementor-element elementor-element-b0bcd92 elementor-widget elementor-widget-text-editor">
                            <div className="elementor-widget-container">
                              <p>
                                {"Our company started as a small venture on April 12, 2019, with zero monetary capital during the "}
                                <strong>
                                  {"lockdown pandemic"}
                                </strong>
                                {"."}
                              </p>
                            </div>
                          </div>
                          <div className="elementor-element elementor-element-f1715f3 elementor-widget elementor-widget-heading">
                            <div className="elementor-widget-container">
                              <h6 className="elementor-heading-title elementor-size-default">
                                {"2019"}
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div className="elementor-element elementor-element-df40f53 e-con-full bottom-e-heights e-flex e-con e-child">
                          <div className="elementor-element elementor-element-f187bfb elementor-widget elementor-widget-heading">
                            <div className="elementor-widget-container">
                              <h6 className="elementor-heading-title elementor-size-default">
                                {" "}
                              </h6>
                            </div>
                          </div>
                          <div className="elementor-element elementor-element-3cfd0c2 elementor-widget elementor-widget-text-editor">
                            <div className="elementor-widget-container">
                              {"   "}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="swiper-slide" role="group" aria-roledescription="slide" aria-label="2 of 7">
                  <div className="elementor-element elementor-element-d329b65 e-flex e-con-boxed e-con e-child">
                    <div className="e-con-inner">
                      <div className="elementor-element elementor-element-1b17d64 e-con-full e-flex e-con e-child">
                        <div className="elementor-element elementor-element-6a1c76e e-con-full top-e-heights e-flex e-con e-child">
                          <div className="elementor-element elementor-element-ce5ff37 elementor-widget elementor-widget-text-editor">
                            <div className="elementor-widget-container">
                              {"   "}
                            </div>
                          </div>
                          <div className="elementor-element elementor-element-77a121a elementor-widget elementor-widget-heading">
                            <div className="elementor-widget-container">
                              <h6 className="elementor-heading-title elementor-size-default">
                                {" "}
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div className="elementor-element elementor-element-7757f99 e-con-full bottom-e-heights e-flex e-con e-child">
                          <div className="elementor-element elementor-element-f6cff1e elementor-widget elementor-widget-heading">
                            <div className="elementor-widget-container">
                              <h6 className="elementor-heading-title elementor-size-default">
                                {"2020"}
                              </h6>
                            </div>
                          </div>
                          <div className="elementor-element elementor-element-c282c88 elementor-widget elementor-widget-text-editor">
                            <div className="elementor-widget-container">
                              <p>
                                {"In just a short span of time, PLDT Enterprise acknowledged us and formed a partnership with us to extend their market reach to MSME and SME clients."}
                              </p>
                              <p>
                                {"Within the year, we were able to help "}
                                <strong>
                                  {"80+ MSMEs and SMEs"}
                                </strong>
                                {" by providing them with reliable internet and voice, security, and other IT solutions."}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="swiper-slide" role="group" aria-roledescription="slide" aria-label="3 of 7">
                  <div className="elementor-element elementor-element-fe29103 e-flex e-con-boxed e-con e-child">
                    <div className="e-con-inner">
                      <div className="elementor-element elementor-element-51f0ab8 e-con-full e-flex e-con e-child">
                        <div className="elementor-element elementor-element-aa46a55 e-con-full top-e-heights e-flex e-con e-child">
                          <div className="elementor-element elementor-element-09774be elementor-widget elementor-widget-text-editor">
                            <div className="elementor-widget-container">
                              <p>
                                {"PLDT Home formed a partnership with us to extend our market to households."}
                              </p>
                              <p>
                                {"Within the year, we were able to help "}
                                <strong>
                                  {"5,000+ Households, including 100+ MSMEs and SMEs"}
                                </strong>
                                {", with their internet, security, and other IT requirements."}
                              </p>
                            </div>
                          </div>
                          <div className="elementor-element elementor-element-9c96e67 elementor-widget elementor-widget-heading">
                            <div className="elementor-widget-container">
                              <h6 className="elementor-heading-title elementor-size-default">
                                {"2021"}
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div className="elementor-element elementor-element-3932495 e-con-full bottom-e-heights e-flex e-con e-child">
                          <div className="elementor-element elementor-element-305d3d2 elementor-widget elementor-widget-heading">
                            <div className="elementor-widget-container">
                              <h6 className="elementor-heading-title elementor-size-default">
                                {" "}
                              </h6>
                            </div>
                          </div>
                          <div className="elementor-element elementor-element-e2998bd elementor-widget elementor-widget-text-editor">
                            <div className="elementor-widget-container">
                              {"   "}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="swiper-slide" role="group" aria-roledescription="slide" aria-label="4 of 7">
                  <div className="elementor-element elementor-element-11db28e e-flex e-con-boxed e-con e-child">
                    <div className="e-con-inner">
                      <div className="elementor-element elementor-element-fe9fa8c e-con-full e-flex e-con e-child">
                        <div className="elementor-element elementor-element-12e480c e-con-full top-e-heights e-flex e-con e-child">
                          <div className="elementor-element elementor-element-defb5e6 elementor-widget elementor-widget-text-editor">
                            <div className="elementor-widget-container">
                              {"   "}
                            </div>
                          </div>
                          <div className="elementor-element elementor-element-5c434d2 elementor-widget elementor-widget-heading">
                            <div className="elementor-widget-container">
                              <h6 className="elementor-heading-title elementor-size-default">
                                {" "}
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div className="elementor-element elementor-element-75bc4de e-con-full bottom-e-heights e-flex e-con e-child">
                          <div className="elementor-element elementor-element-44977cd elementor-widget elementor-widget-heading">
                            <div className="elementor-widget-container">
                              <h6 className="elementor-heading-title elementor-size-default">
                                {"2021-2022"}
                              </h6>
                            </div>
                          </div>
                          <div className="elementor-element elementor-element-a289dd2 elementor-widget elementor-widget-text-editor">
                            <div className="elementor-widget-container">
                              <p>
                                {"With our notable contributions to the IT and Telecom industry, we received prestigious awards and recognition from a well-known company such as PLDT."}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="swiper-slide" role="group" aria-roledescription="slide" aria-label="5 of 7">
                  <div className="elementor-element elementor-element-1328312 e-flex e-con-boxed e-con e-child">
                    <div className="e-con-inner">
                      <div className="elementor-element elementor-element-5115f93 e-con-full e-flex e-con e-child">
                        <div className="elementor-element elementor-element-72073bf e-con-full top-e-heights e-flex e-con e-child">
                          <div className="elementor-element elementor-element-306b8a2 elementor-widget elementor-widget-text-editor">
                            <div className="elementor-widget-container">
                              <p>
                                {"To give back to the community, we shared the blessings we received through our organization by providing those without livelihood an opportunity to earn."}
                              </p>
                              <p>
                                {"In the same year, our agent network grew from 0 to "}
                                <strong>
                                  {"50+ active partners nationwide"}
                                </strong>
                                {"."}
                              </p>
                            </div>
                          </div>
                          <div className="elementor-element elementor-element-ba5993f elementor-widget elementor-widget-heading">
                            <div className="elementor-widget-container">
                              <h6 className="elementor-heading-title elementor-size-default">
                                {"2022"}
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div className="elementor-element elementor-element-d3dd0cb e-con-full bottom-e-heights e-flex e-con e-child">
                          <div className="elementor-element elementor-element-7945742 elementor-widget elementor-widget-heading">
                            <div className="elementor-widget-container">
                              <h6 className="elementor-heading-title elementor-size-default">
                                {" "}
                              </h6>
                            </div>
                          </div>
                          <div className="elementor-element elementor-element-e8ecfc8 elementor-widget elementor-widget-text-editor">
                            <div className="elementor-widget-container">
                              {"   "}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="swiper-slide" role="group" aria-roledescription="slide" aria-label="6 of 7">
                  <div className="elementor-element elementor-element-af89a64 e-flex e-con-boxed e-con e-child">
                    <div className="e-con-inner">
                      <div className="elementor-element elementor-element-a9b4bad e-con-full e-flex e-con e-child">
                        <div className="elementor-element elementor-element-344b05e e-con-full top-e-heights e-flex e-con e-child">
                          <div className="elementor-element elementor-element-c95c00a elementor-widget elementor-widget-text-editor">
                            <div className="elementor-widget-container">
                              {"   "}
                            </div>
                          </div>
                          <div className="elementor-element elementor-element-900d56d elementor-widget elementor-widget-heading">
                            <div className="elementor-widget-container">
                              <h6 className="elementor-heading-title elementor-size-default">
                                {" "}
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div className="elementor-element elementor-element-9681b39 e-con-full bottom-e-heights e-flex e-con e-child">
                          <div className="elementor-element elementor-element-c6863d8 elementor-widget elementor-widget-heading">
                            <div className="elementor-widget-container">
                              <h6 className="elementor-heading-title elementor-size-default">
                                {"2023"}
                              </h6>
                            </div>
                          </div>
                          <div className="elementor-element elementor-element-452db82 elementor-widget elementor-widget-text-editor">
                            <div className="elementor-widget-container">
                              <p>
                                {"As lockdowns were lifted, we decided to move from a virtual setup to a physical office, and permanently hire employees."}
                              </p>
                              <p>
                                {"By the end of the year, we were able to serve "}
                                <strong>
                                  {"28,000+ Households and 300+ SMEs, MSMEs, and Government Nationwide"}
                                </strong>
                                {". We also have "}
                                <strong>
                                  {"80+ active partners, team sales leaders, and agents"}
                                </strong>
                                {", continuously growing."}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="swiper-slide" role="group" aria-roledescription="slide" aria-label="7 of 7">
                  <div className="elementor-element elementor-element-7c2de8f e-flex e-con-boxed e-con e-child">
                    <div className="e-con-inner">
                      <div className="elementor-element elementor-element-3685aa3 e-con-full e-flex e-con e-child">
                        <div className="elementor-element elementor-element-e814431 e-con-full top-e-heights e-flex e-con e-child">
                          <div className="elementor-element elementor-element-c486d63 elementor-widget elementor-widget-text-editor">
                            <div className="elementor-widget-container">
                              <p>
                                {"As of date, we already serve "}
                                <strong>
                                  {"+30,000 Households nationwide"}
                                </strong>
                                {". We also received awards and recognition early this year from reputable partners and organizations."}
                              </p>
                            </div>
                          </div>
                          <div className="elementor-element elementor-element-4a040ec elementor-widget elementor-widget-heading">
                            <div className="elementor-widget-container">
                              <h6 className="elementor-heading-title elementor-size-default">
                                {"2024"}
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div className="elementor-element elementor-element-13ec293 e-con-full bottom-e-heights e-flex e-con e-child">
                          <div className="elementor-element elementor-element-2a2ff4e elementor-widget elementor-widget-heading">
                            <div className="elementor-widget-container">
                              <h6 className="elementor-heading-title elementor-size-default">
                                {" "}
                              </h6>
                            </div>
                          </div>
                          <div className="elementor-element elementor-element-93d1fb5 elementor-widget elementor-widget-text-editor">
                            <div className="elementor-widget-container">
                              {"   "}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </MilestoneCarousel>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Customers() {
  return (
    <div className="elementor-element elementor-element-0715383 e-flex e-con-boxed e-con e-parent">
      <div className="e-con-inner">
        <div className="elementor-element elementor-element-d7787e8 e-con-full e-flex e-con e-child">
          <div className="elementor-element elementor-element-9e8ee69 elementor-widget elementor-widget-template">
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
    <div className="elementor-element elementor-element-00bf883 e-flex e-con-boxed e-con e-parent">
      <div className="e-con-inner">
        <div className="elementor-element elementor-element-3d68e12 elementor-widget elementor-widget-template">
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

export function VisionMission() {
  return (
    <div className="elementor-element elementor-element-3359530 e-con-full e-flex e-con e-parent">
      <div className="elementor-element elementor-element-e0cd9c4 e-flex e-con-boxed e-con e-child">
        <div className="e-con-inner">
          <div className="elementor-element elementor-element-9598a82 elementor-widget elementor-widget-heading">
            <div className="elementor-widget-container">
              <h2 className="elementor-heading-title elementor-size-default">
                {"Vision"}
              </h2>
            </div>
          </div>
          <div className="elementor-element elementor-element-83775e6 elementor-widget elementor-widget-text-editor">
            <div className="elementor-widget-container">
              <p>
                {"To shape the future of IT and Telecom by redefining industry standards, creating lasting impact, and becoming a go-to partner to businesses and households seeking transformative Security and IT solutions."}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="elementor-element elementor-element-03b4c22 e-flex e-con-boxed e-con e-child">
        <div className="e-con-inner">
          <div className="elementor-element elementor-element-d45e1b6 elementor-widget elementor-widget-heading">
            <div className="elementor-widget-container">
              <h2 className="elementor-heading-title elementor-size-default">
                {"Mission"}
              </h2>
            </div>
          </div>
          <div className="elementor-element elementor-element-9d6c2c9 elementor-widget elementor-widget-text-editor">
            <div className="elementor-widget-container">
              <p>
                {"To provide innovative solutions to our partners in terms of Security, Telecom, and IT solutions and deliver the best quality of products and services, ensuring them a seamless business transaction and exceeding their satisfaction."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CorporateValues() {
  return (
    <div className="elementor-element elementor-element-eae3877 e-flex e-con-boxed e-con e-parent">
      <div className="e-con-inner">
        <div className="elementor-element elementor-element-468fcf5 elementor-widget elementor-widget-heading">
          <div className="elementor-widget-container">
            <h2 className="elementor-heading-title elementor-size-default">
              {"Corporate Values"}
            </h2>
          </div>
        </div>
        <div className="elementor-element elementor-element-2a56375 e-con-full e-flex e-con e-child">
          <div className="elementor-element elementor-element-80ee3da e-con-full e-flex e-con e-child">
            <div className="elementor-element elementor-element-b10d0f4 e-con-full e-flex e-con e-child">
              <div className="elementor-element elementor-element-41d57f7 elementor-widget elementor-widget-heading">
                <div className="elementor-widget-container">
                  <h2 className="elementor-heading-title elementor-size-default">
                    {"S"}
                  </h2>
                </div>
              </div>
              <div className="elementor-element elementor-element-44b2ae6 elementor-widget elementor-widget-heading">
                <div className="elementor-widget-container">
                  <h4 className="elementor-heading-title elementor-size-default">
                    {"Success"}
                  </h4>
                </div>
              </div>
              <div className="elementor-element elementor-element-34fd979 elementor-widget elementor-widget-text-editor">
                <div className="elementor-widget-container">
                  <p>
                    {"in exceeding client satisfaction."}
                  </p>
                </div>
              </div>
            </div>
            <div className="elementor-element elementor-element-9559ee9 e-con-full e-flex e-con e-child">
              <div className="elementor-element elementor-element-d7c7786 elementor-widget elementor-widget-heading">
                <div className="elementor-widget-container">
                  <h2 className="elementor-heading-title elementor-size-default">
                    {"E"}
                  </h2>
                </div>
              </div>
              <div className="elementor-element elementor-element-60011e4 elementor-widget elementor-widget-heading">
                <div className="elementor-widget-container">
                  <h4 className="elementor-heading-title elementor-size-default">
                    {"Excellence"}
                  </h4>
                </div>
              </div>
              <div className="elementor-element elementor-element-21370d2 elementor-widget elementor-widget-text-editor">
                <div className="elementor-widget-container">
                  <p>
                    {"in service and in empowering our team to always bring out the best."}
                  </p>
                </div>
              </div>
            </div>
            <div className="elementor-element elementor-element-68d0ff9 e-con-full e-flex e-con e-child">
              <div className="elementor-element elementor-element-da23f26 elementor-widget elementor-widget-heading">
                <div className="elementor-widget-container">
                  <h2 className="elementor-heading-title elementor-size-default">
                    {"C"}
                  </h2>
                </div>
              </div>
              <div className="elementor-element elementor-element-2d705f3 elementor-widget elementor-widget-heading">
                <div className="elementor-widget-container">
                  <h4 className="elementor-heading-title elementor-size-default">
                    {"Commitment"}
                  </h4>
                </div>
              </div>
              <div className="elementor-element elementor-element-b265a48 elementor-widget elementor-widget-text-editor">
                <div className="elementor-widget-container">
                  <p>
                    {"to provide the best solution and building long-term relationship among our partners."}
                  </p>
                </div>
              </div>
            </div>
            <div className="elementor-element elementor-element-a45602a e-con-full e-flex e-con e-child">
              <div className="elementor-element elementor-element-5293196 elementor-widget elementor-widget-heading">
                <div className="elementor-widget-container">
                  <h2 className="elementor-heading-title elementor-size-default">
                    {"U"}
                  </h2>
                </div>
              </div>
              <div className="elementor-element elementor-element-a29498a elementor-widget elementor-widget-heading">
                <div className="elementor-widget-container">
                  <h4 className="elementor-heading-title elementor-size-default">
                    {"Uplift"}
                  </h4>
                </div>
              </div>
              <div className="elementor-element elementor-element-72f3bd0 elementor-widget elementor-widget-text-editor">
                <div className="elementor-widget-container">
                  <p>
                    {"people’s lives and improve our society."}
                  </p>
                </div>
              </div>
            </div>
            <div className="elementor-element elementor-element-761111e e-con-full e-flex e-con e-child">
              <div className="elementor-element elementor-element-6dd0c9d elementor-widget elementor-widget-heading">
                <div className="elementor-widget-container">
                  <h2 className="elementor-heading-title elementor-size-default">
                    {"R"}
                  </h2>
                </div>
              </div>
              <div className="elementor-element elementor-element-9a8d8b0 elementor-widget elementor-widget-heading">
                <div className="elementor-widget-container">
                  <h4 className="elementor-heading-title elementor-size-default">
                    {"Reliability"}
                  </h4>
                </div>
              </div>
              <div className="elementor-element elementor-element-9b1c3cd elementor-widget elementor-widget-text-editor">
                <div className="elementor-widget-container">
                  <p>
                    {"to provide the best products and services."}
                  </p>
                </div>
              </div>
            </div>
            <div className="elementor-element elementor-element-b4bef0b e-con-full e-flex e-con e-child">
              <div className="elementor-element elementor-element-9ad78ab elementor-widget elementor-widget-heading">
                <div className="elementor-widget-container">
                  <h2 className="elementor-heading-title elementor-size-default">
                    {"I"}
                  </h2>
                </div>
              </div>
              <div className="elementor-element elementor-element-fecc79a elementor-widget elementor-widget-heading">
                <div className="elementor-widget-container">
                  <h4 className="elementor-heading-title elementor-size-default">
                    {"Integrity"}
                  </h4>
                </div>
              </div>
              <div className="elementor-element elementor-element-819eafc elementor-widget elementor-widget-text-editor">
                <div className="elementor-widget-container">
                  <p>
                    {"in every aspect of our work."}
                  </p>
                </div>
              </div>
            </div>
            <div className="elementor-element elementor-element-703b098 e-con-full e-flex e-con e-child">
              <div className="elementor-element elementor-element-936585a elementor-widget elementor-widget-heading">
                <div className="elementor-widget-container">
                  <h2 className="elementor-heading-title elementor-size-default">
                    {"T"}
                  </h2>
                </div>
              </div>
              <div className="elementor-element elementor-element-d187a4c elementor-widget elementor-widget-heading">
                <div className="elementor-widget-container">
                  <h4 className="elementor-heading-title elementor-size-default">
                    {"Teamwork"}
                  </h4>
                </div>
              </div>
              <div className="elementor-element elementor-element-c1a3af4 elementor-widget elementor-widget-text-editor">
                <div className="elementor-widget-container">
                  <p>
                    {"is our key to understand and achieve our goals altogether."}
                  </p>
                </div>
              </div>
            </div>
            <div className="elementor-element elementor-element-35803ce e-con-full e-flex e-con e-child">
              <div className="elementor-element elementor-element-7f250f9 elementor-widget elementor-widget-heading">
                <div className="elementor-widget-container">
                  <h2 className="elementor-heading-title elementor-size-default">
                    {"Y"}
                  </h2>
                </div>
              </div>
              <div className="elementor-element elementor-element-d1f9a13 elementor-widget elementor-widget-heading">
                <div className="elementor-widget-container">
                  <h4 className="elementor-heading-title elementor-size-default">
                    {"YES we can!"}
                  </h4>
                </div>
              </div>
              <div className="elementor-element elementor-element-97168c7 elementor-widget elementor-widget-text-editor">
                <div className="elementor-widget-container">
                  <p>
                    {"We walk the talk."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Team() {
  return (
    <div className="elementor-element elementor-element-9e2847e e-flex e-con-boxed e-con e-parent">
      <div className="e-con-inner">
        <div className="elementor-element elementor-element-49e3658 e-con-full e-flex e-con e-child">
          <div className="elementor-element elementor-element-0e2b6b8 elementor-widget elementor-widget-heading">
            <div className="elementor-widget-container">
              <h5 className="elementor-heading-title elementor-size-default">
                {"Our Team"}
              </h5>
            </div>
          </div>
          <div className="elementor-element elementor-element-5f2f8d6 elementor-widget elementor-widget-heading">
            <div className="elementor-widget-container">
              <h2 className="elementor-heading-title elementor-size-default">
                {"Our tech experts "}
                <br />
                {"are always ready "}
                <br />
                {"to assist you"}
              </h2>
            </div>
          </div>
          <div className="elementor-element elementor-element-f1a540f elementor-widget elementor-widget-text-editor">
            <div className="elementor-widget-container">
              <p>
                {"With our proven experience in security, telecom, and IT, you can trust our team to recommend the best technological solutions for your business. Our strong technical knowledge in hardware and software also guarantees that we can handle installation tasks with confidence, precision, and expertise."}
              </p>
            </div>
          </div>
        </div>
        <div className="elementor-element elementor-element-b1af1fd e-con-full e-flex e-con e-child">
          <div className="elementor-element elementor-element-decc4f1 elementor-widget elementor-widget-image">
            <div className="elementor-widget-container">
              <img loading="lazy" decoding="async" width="1024" height="966" src="/images/pexels-cottonbro-6803551@2x-1024x966.jpg" alt="Our technology team at work" srcSet="/images/pexels-cottonbro-6803551@2x-1024x966.jpg 1024w, /images/pexels-cottonbro-6803551@2x-300x283.jpg 300w, /images/pexels-cottonbro-6803551@2x-768x724.jpg 768w, /images/pexels-cottonbro-6803551@2x-1536x1449.jpg 1536w, /images/pexels-cottonbro-6803551@2x.jpg 1599w" sizes="(max-width: 1024px) 100vw, 1024px" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
