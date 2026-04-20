(function () {
  const placeholder = document.getElementById('site-footer');
  if (!placeholder) return;

  placeholder.outerHTML = `
  <footer class="footer">
    <div class="container">
      <div class="footer__grid">
        <div class="footer__brand">
          <div class="nav__logo"><img src="img/logos/endor_logo.png" alt="EndoR Surgical" class="nav__logo-img"></div>
          <p data-i18n="footer.tagline">Advancing endoluminal surgery to the next horizon through flexible robotics.</p>
        </div>
        <div>
          <h4 class="footer__heading" data-i18n="footer.platform">Platform</h4>
          <ul class="footer__links">
            <li><a href="platform.html" data-i18n="footer.platform.link">EndoR Platform</a></li>
            <li><a href="platform.html#clinical-evidence" data-i18n="footer.clinical">Clinical Evidence</a></li>
          </ul>
        </div>
        <div>
          <h4 class="footer__heading" data-i18n="footer.company">Company</h4>
          <ul class="footer__links">
            <li><a href="about.html" data-i18n="footer.about">About Us</a></li>
            <li><a href="team.html" data-i18n="footer.team">Team</a></li>
          </ul>
        </div>
        <div>
          <h4 class="footer__heading" data-i18n="footer.contact">Contact</h4>
          <ul class="footer__links">
            <li><a href="contact.html" data-i18n="footer.contactus">Contact Us</a></li>
          </ul>
        </div>
      </div>
      <div class="footer__bottom">
        <span data-i18n="footer.copyright">&copy; 2026 EndoR. All rights reserved.</span>
        <span><span data-i18n="footer.privacy">Privacy Policy</span> &middot; <span data-i18n="footer.terms">Terms of Use</span></span>
      </div>
    </div>
  </footer>`;
})();
