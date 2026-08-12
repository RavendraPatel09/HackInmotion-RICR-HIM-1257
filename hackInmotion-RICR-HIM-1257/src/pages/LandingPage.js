export function renderLandingPage() {
  return `
    <style>
      .landing-section { padding: var(--spacing-2xl) 0; }
      .landing-hero {
        background: linear-gradient(135deg, var(--brand-navy) 0%, color-mix(in srgb, var(--brand-navy) 80%, var(--brand-green)) 100%);
        color: white; padding: 80px 20px; text-align: center; border-radius: 0 0 32px 32px; margin-top: -1px;
      }
      .landing-hero .display-lg { color: white; margin-bottom: var(--spacing-md); }
      .landing-hero p { color: color-mix(in srgb, white 80%, transparent); max-width: 600px; margin: 0 auto var(--spacing-xl); }
      
      .map-preview-container {
        background: #e2e8f0; border-radius: var(--radius-lg); height: 400px; position: relative; overflow: hidden;
        background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 20px 20px;
        box-shadow: inset 0 0 40px rgba(0,0,0,0.05); border: 2px solid white;
      }
      .map-pin { position: absolute; width: 16px; height: 16px; border-radius: 50%; background: var(--error); box-shadow: 0 0 0 4px color-mix(in srgb, var(--error) 20%, transparent); animation: pulse 2s infinite; }
      @keyframes pulse { 0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--error) 40%, transparent); } 70% { box-shadow: 0 0 0 10px transparent; } 100% { box-shadow: 0 0 0 0 transparent; } }
      
      .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--spacing-lg); }
      .grid-4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--spacing-md); }
      
      .stat-card { text-align: center; padding: var(--spacing-xl); background: var(--surface-container-lowest); border-radius: var(--radius-lg); box-shadow: var(--elevation-1); }
      .stat-number { font-size: 48px; font-weight: 700; color: var(--brand-green); line-height: 1; margin-bottom: var(--spacing-sm); }
      
      .before-after-container { display: flex; gap: var(--spacing-sm); flex-direction: column; }
      @media (min-width: 768px) { .before-after-container { flex-direction: row; } }
      .ba-img { flex: 1; height: 250px; border-radius: var(--radius-md); display: flex; align-items: flex-end; padding: var(--spacing-md); color: white; font-weight: 600; text-shadow: 0 1px 4px rgba(0,0,0,0.5); }
      .ba-before { background: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.6)), #a3a3a3; }
      .ba-after { background: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.6)), #4ade80; }
      
      .category-card { text-align: center; padding: var(--spacing-lg); border: 1px solid var(--outline-variant); border-radius: var(--radius-md); transition: all 0.2s; background: var(--surface-container-lowest); }
      .category-card:hover { border-color: var(--brand-green); transform: translateY(-4px); box-shadow: var(--elevation-1); }
      .category-icon { font-size: 32px; margin-bottom: var(--spacing-sm); }
      
      .testimonial { border-left: 4px solid var(--brand-gold); padding-left: var(--spacing-lg); font-style: italic; color: var(--on-surface-variant); }
      
      .final-cta { background: var(--surface-base); padding: var(--spacing-2xl) 20px; text-align: center; border-radius: var(--radius-xl); margin: var(--spacing-2xl) 0; }
    </style>

    <!-- 1. Hero -->
    <section class="landing-hero">
      <div class="container" style="max-width: 800px;">
        <h1 class="display-lg">SMART BHOPAL</h1>
        <h2 class="headline-md" style="color: white; margin-bottom: var(--spacing-sm);">Make Bhopal Better, One Issue at a Time.</h2>
        <p class="body-lg">Report civic problems, track their resolution, and help build a cleaner, safer and smarter Bhopal.</p>
        <div class="flex gap-md justify-center mt-lg" style="flex-wrap: wrap;">
          <a href="#/citizen/report" class="btn btn-primary" style="padding: var(--spacing-md) var(--spacing-xl); font-size: 18px;">Report an Issue</a>
          <a href="#/citizen" class="btn btn-secondary" style="border-color: rgba(255,255,255,0.3); color: white; padding: var(--spacing-md) var(--spacing-xl); font-size: 18px;">Explore City Issues</a>
        </div>
      </div>
    </section>

    <div class="container" style="max-width: 1200px; padding-top: var(--spacing-2xl);">
      
      <!-- 2. Civic Map Preview -->
      <section class="landing-section">
        <div class="flex justify-between items-end mb-lg">
          <div>
            <h2 class="headline-lg mb-sm">Live City Map</h2>
            <p class="body-lg text-muted">See what's happening around Bhopal in real-time.</p>
          </div>
          <span class="badge badge-success hidden md:flex"><span class="status-dot active"></span> 142 Active Issues</span>
        </div>
        <div class="map-preview-container">
          <!-- Simulated Map Pins -->
          <div class="map-pin" style="top: 30%; left: 40%;"></div>
          <div class="map-pin" style="top: 55%; left: 70%; background: var(--warning); box-shadow: 0 0 0 4px color-mix(in srgb, var(--warning) 20%, transparent);"></div>
          <div class="map-pin" style="top: 20%; left: 80%;"></div>
          <div class="map-pin" style="top: 70%; left: 25%; background: var(--success); box-shadow: 0 0 0 4px color-mix(in srgb, var(--success) 20%, transparent); animation: none;"></div>
          
          <!-- Simulated Issue Card Overlay -->
          <div class="issue-card" style="position: absolute; bottom: 20px; left: 20px; width: 300px; box-shadow: var(--elevation-3);">
            <div class="issue-card-icon">🚰</div>
            <div class="issue-card-content">
              <div style="font-weight: 600;">Water Leakage</div>
              <div class="issue-card-meta"><span>Arera Colony</span> <span class="badge badge-warning">Pending</span></div>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. How Smart Bhopal Works -->
      <section class="landing-section">
        <h2 class="headline-lg text-center mb-xl">How It Works</h2>
        <div class="grid-3">
          <div class="card" style="text-align: center; border: none; background: transparent; box-shadow: none;">
            <div style="width: 64px; height: 64px; background: var(--surface-base); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto var(--spacing-md); color: var(--brand-navy);">1</div>
            <h3 class="title-lg mb-sm">Report</h3>
            <p class="body-md text-muted">Snap a photo, add location details, and submit a civic complaint in seconds.</p>
          </div>
          <div class="card" style="text-align: center; border: none; background: transparent; box-shadow: none;">
            <div style="width: 64px; height: 64px; background: var(--surface-base); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto var(--spacing-md); color: var(--brand-navy);">2</div>
            <h3 class="title-lg mb-sm">Track</h3>
            <p class="body-md text-muted">Get real-time updates as authorities assign and work on your reported issue.</p>
          </div>
          <div class="card" style="text-align: center; border: none; background: transparent; box-shadow: none;">
            <div style="width: 64px; height: 64px; background: color-mix(in srgb, var(--brand-green) 15%, transparent); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto var(--spacing-md); color: var(--brand-green);">3</div>
            <h3 class="title-lg mb-sm">Resolve</h3>
            <p class="body-md text-muted">The issue is fixed by the municipal corporation, making Bhopal better for everyone.</p>
          </div>
        </div>
      </section>

      <!-- 4. Issue Categories -->
      <section class="landing-section">
        <h2 class="headline-lg mb-lg">What can you report?</h2>
        <div class="grid-4">
          <div class="category-card">
            <div class="category-icon">🛣️</div>
            <div class="label-md">Infrastructure</div>
          </div>
          <div class="category-card">
            <div class="category-icon">🗑️</div>
            <div class="label-md">Sanitation</div>
          </div>
          <div class="category-card">
            <div class="category-icon">💧</div>
            <div class="label-md">Water Supply</div>
          </div>
          <div class="category-card">
            <div class="category-icon">💡</div>
            <div class="label-md">Electricity</div>
          </div>
          <div class="category-card">
            <div class="category-icon">🌳</div>
            <div class="label-md">Public Parks</div>
          </div>
        </div>
      </section>

      <!-- 5. City Activity & 6. Transparency -->
      <section class="landing-section">
        <div class="grid-3">
          <div style="grid-column: span 2;">
            <h2 class="headline-lg mb-lg">Live City Activity</h2>
            <div class="flex flex-column gap-md">
              <div class="issue-card">
                <div class="issue-card-icon" style="background: color-mix(in srgb, var(--success) 15%, transparent);">✅</div>
                <div class="issue-card-content">
                  <div style="font-weight: 600;">Streetlight Fixed</div>
                  <div class="issue-card-meta"><span>MP Nagar Zone 1</span> <span class="body-md text-muted">2 mins ago</span></div>
                </div>
              </div>
              <div class="issue-card">
                <div class="issue-card-icon" style="background: color-mix(in srgb, var(--warning) 15%, transparent);">🚧</div>
                <div class="issue-card-content">
                  <div style="font-weight: 600;">Pothole Repair Started</div>
                  <div class="issue-card-meta"><span>Hoshangabad Road</span> <span class="body-md text-muted">15 mins ago</span></div>
                </div>
              </div>
              <div class="issue-card">
                <div class="issue-card-icon" style="background: var(--surface-base);">📝</div>
                <div class="issue-card-content">
                  <div style="font-weight: 600;">New Issue: Garbage Overflow</div>
                  <div class="issue-card-meta"><span>Shahpura</span> <span class="body-md text-muted">1 hr ago</span></div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 class="headline-lg mb-lg">Transparency</h2>
            <div class="flex flex-column gap-md">
              <div class="stat-card">
                <div class="stat-number">1,204</div>
                <div class="label-md text-muted">Issues Resolved This Month</div>
              </div>
              <div class="stat-card">
                <div class="stat-number" style="color: var(--brand-navy);">48h</div>
                <div class="label-md text-muted">Average Resolution Time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 7. Before / After Resolution -->
      <section class="landing-section">
        <h2 class="headline-lg mb-lg">Real Impact</h2>
        <div class="before-after-container">
          <div class="ba-img ba-before">
            <div><span class="badge badge-error mb-xs">Before</span><br>Overflowing bins at Kolar Road</div>
          </div>
          <div class="ba-img ba-after">
            <div><span class="badge badge-success mb-xs">After</span><br>Cleaned and sanitized within 24hrs</div>
          </div>
        </div>
      </section>

      <!-- 8. Community Impact -->
      <section class="landing-section">
        <h2 class="headline-lg mb-lg">Community Voices</h2>
        <div class="grid-3">
          <div class="card">
            <p class="testimonial mb-md">"I reported a broken streetlight in our colony. It was fixed the very next evening. Smart Bhopal actually works!"</p>
            <div class="flex items-center gap-sm">
              <div style="width: 32px; height: 32px; background: var(--brand-navy); border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-size: 12px;">A</div>
              <div><div class="label-md">Amit Sharma</div><div class="caption text-muted">Arera Colony</div></div>
            </div>
          </div>
          <div class="card">
            <p class="testimonial mb-md">"The tracking feature is brilliant. I knew exactly which department was handling my water supply complaint."</p>
            <div class="flex items-center gap-sm">
              <div style="width: 32px; height: 32px; background: var(--brand-green); border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-size: 12px;">P</div>
              <div><div class="label-md">Priya Patel</div><div class="caption text-muted">BHEL</div></div>
            </div>
          </div>
        </div>
      </section>

      <!-- 9. Final CTA -->
      <section class="final-cta">
        <h2 class="display-lg mb-md">Ready to make a difference?</h2>
        <p class="body-lg text-muted mb-lg">Join thousands of citizens improving Bhopal daily.</p>
        <a href="#/citizen/report" class="btn btn-primary" style="padding: var(--spacing-md) var(--spacing-xl); font-size: 18px;">Start Reporting</a>
      </section>
      
    </div>
  `;
}
