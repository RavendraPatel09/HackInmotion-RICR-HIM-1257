import { issueService } from '../services/issueService.js';
import { duplicateDetectionService } from '../services/duplicateDetectionService.js';
import { renderDuplicateDetectionPanel } from '../components/DuplicateDetectionPanel.js';

export function renderCitizenReport() {
  return `
    <style>
      .wizard-step { display: none; animation: fadeIn 0.3s ease; }
      .wizard-step.active { display: block; }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      
      .category-card { cursor: pointer; transition: all 0.2s; border: 2px solid var(--outline-variant); }
      .category-card.selected { border-color: var(--brand-green); background-color: color-mix(in srgb, var(--brand-green) 5%, transparent); box-shadow: var(--elevation-1); }
      
      .wizard-progress { display: flex; gap: 4px; margin-bottom: var(--spacing-xl); }
      .wizard-progress-bar { flex: 1; height: 4px; background: var(--outline-variant); border-radius: 2px; transition: background 0.3s; }
      .wizard-progress-bar.active { background: var(--brand-green); }
      
      .bottom-nav-spacer { height: 80px; } /* To prevent overlap with fixed bottom actions */
      
      .wizard-actions { position: fixed; bottom: 0; left: 0; right: 0; background: var(--surface-container-lowest); padding: var(--spacing-md) var(--spacing-lg); box-shadow: 0 -4px 12px rgba(0,0,0,0.05); z-index: 100; display: flex; justify-content: space-between; gap: var(--spacing-md); }
      @media(min-width: 768px) { .wizard-actions { position: static; box-shadow: none; padding: var(--spacing-xl) 0 0; background: transparent; } .bottom-nav-spacer { display: none; } }
      
      #evidence-preview-container { display: none; position: relative; border-radius: var(--radius-md); overflow: hidden; height: 250px; background: #000; }
      #evidence-preview-img { width: 100%; height: 100%; object-fit: contain; }
      .preview-actions { position: absolute; bottom: 0; left: 0; right: 0; padding: var(--spacing-sm); background: linear-gradient(transparent, rgba(0,0,0,0.7)); display: flex; justify-content: space-between; }
    </style>

    <div class="mb-lg">
      <div class="flex items-center gap-md mb-lg">
        <a href="#/citizen" class="btn-icon" style="text-decoration: none; font-size: 20px;">←</a>
        <h2 class="headline-md m-0">Report Issue</h2>
      </div>

      <!-- Progress Bar -->
      <div class="wizard-progress" id="wizard-progress">
        <div class="wizard-progress-bar active"></div>
        <div class="wizard-progress-bar"></div>
        <div class="wizard-progress-bar"></div>
        <div class="wizard-progress-bar"></div>
        <div class="wizard-progress-bar"></div>
      </div>
      
      <!-- STEP 1: CATEGORY -->
      <div class="wizard-step active" id="step-1">
        <h3 class="title-lg mb-sm">What type of issue is it?</h3>
        <p class="body-md text-muted mb-lg">Select the category that best fits.</p>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md);">
          <div class="card category-card" data-category="Roads">
            <div class="display-sm mb-xs">🛣️</div>
            <div class="label-md">Roads</div>
          </div>
          <div class="card category-card" data-category="Waste">
            <div class="display-sm mb-xs">🗑️</div>
            <div class="label-md">Waste</div>
          </div>
          <div class="card category-card" data-category="Water">
            <div class="display-sm mb-xs">🚰</div>
            <div class="label-md">Water</div>
          </div>
          <div class="card category-card" data-category="Drainage">
            <div class="display-sm mb-xs">🌊</div>
            <div class="label-md">Drainage</div>
          </div>
          <div class="card category-card" data-category="Electricity">
            <div class="display-sm mb-xs">💡</div>
            <div class="label-md">Electricity</div>
          </div>
          <div class="card category-card" data-category="Public Property">
            <div class="display-sm mb-xs">🌳</div>
            <div class="label-md">Public Property</div>
          </div>
          <div class="card category-card" data-category="Other" style="grid-column: span 2;">
            <div class="label-md">Other Issue</div>
          </div>
        </div>
      </div>

      <!-- STEP 2: LOCATION -->
      <div class="wizard-step" id="step-2">
        <h3 class="title-lg mb-sm">Where is the issue?</h3>
        <p class="body-md text-muted mb-lg">Pinpoint the exact location for faster resolution.</p>
        
        <div class="input-group mb-md">
          <input type="text" id="loc-search" class="input" placeholder="Search location (e.g. MP Nagar, Zone 1)" />
        </div>
        
        <button class="btn btn-secondary mb-md" id="loc-current" style="width: 100%;">
          <span style="font-size: 18px;">📍</span> Use Current Location
        </button>

        <div class="card" style="padding: 0; overflow: hidden; border: 1px solid var(--outline-variant); height: 200px; position: relative;">
          <div style="height: 100%; background: #e2e8f0; background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 15px 15px;">
            <div class="map-pin" style="top: 50%; left: 50%; animation: none;"></div>
          </div>
          <div style="position: absolute; bottom: 8px; left: 8px; right: 8px; background: white; padding: 8px; border-radius: var(--radius-sm); box-shadow: var(--elevation-1); font-size: 12px; font-weight: 600; text-align: center;" id="loc-display">
            Move map to adjust pin
          </div>
        </div>
      </div>

      <!-- STEP 3: EVIDENCE -->
      <div class="wizard-step" id="step-3">
        <h3 class="title-lg mb-sm">Upload Evidence</h3>
        <p class="body-md text-muted mb-lg">Clear photos help authorities understand the severity.</p>
        
        <!-- Upload Dropzone -->
        <label class="file-upload" id="evidence-upload-zone" style="display: block;">
          <input type="file" id="evidence-input" accept="image/*" style="display: none;" />
          <div class="file-upload-icon mb-sm">📸</div>
          <div class="body-md font-weight-bold">Tap to take photo or upload</div>
          <div class="caption text-muted mt-xs">Max size: 5MB</div>
        </label>

        <!-- Image Preview -->
        <div id="evidence-preview-container">
          <img id="evidence-preview-img" src="" alt="Evidence Preview" />
          <div class="preview-actions">
            <button class="btn btn-secondary" id="evidence-remove" style="border-color: white; color: white;">Remove</button>
            <label class="btn btn-primary" style="margin: 0; cursor: pointer;">
              Replace
              <input type="file" id="evidence-replace" accept="image/*" style="display: none;" />
            </label>
          </div>
        </div>
      </div>

      <!-- STEP 4: DESCRIPTION -->
      <div class="wizard-step" id="step-4">
        <h3 class="title-lg mb-sm">Describe the issue</h3>
        <p class="body-md text-muted mb-lg">Provide any additional context or details.</p>
        
        <div class="input-group">
          <textarea id="desc-input" class="textarea" placeholder="E.g., The pothole is on the left side of the road heading north. It is causing severe traffic." style="height: 150px;"></textarea>
          <div class="flex justify-between mt-xs">
            <span id="desc-error" class="caption text-error hidden">Description is required.</span>
            <span id="desc-counter" class="caption text-muted" style="margin-left: auto;">0 / 500 characters</span>
          </div>
        </div>
      </div>

      <!-- STEP 4.5: DUPLICATE DETECTION -->
      <div class="wizard-step" id="step-duplicate" style="padding-top: var(--spacing-xl);">
        <!-- Injected via JS -->
      </div>

      <!-- STEP 5: REVIEW -->
      <div class="wizard-step" id="step-5">
        <h3 class="title-lg mb-sm">Review & Submit</h3>
        <p class="body-md text-muted mb-lg">Ensure all details are correct before submitting.</p>
        
        <div class="card" style="padding: 0; overflow: hidden; margin-bottom: var(--spacing-xl);">
          <div style="height: 120px; background: #000; position: relative;">
            <img id="review-img" src="" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.8;" />
            <div style="position: absolute; bottom: 8px; left: 8px;"><span class="badge badge-success" id="review-cat">Category</span></div>
          </div>
          <div style="padding: var(--spacing-md);">
            <div class="flex items-start gap-sm mb-sm">
              <div style="font-size: 20px;">📍</div>
              <div id="review-loc" style="font-weight: 600;">Location</div>
            </div>
            <div class="body-md text-muted" id="review-desc" style="white-space: pre-wrap;">Description goes here...</div>
          </div>
        </div>
      </div>

      <!-- SUCCESS STATE (STEP 6) -->
      <div class="wizard-step" id="step-success" style="padding-top: var(--spacing-xl);">
        <div class="empty-state" style="border: none; background: transparent;">
          <div class="empty-state-icon" style="color: var(--success); font-size: 64px; animation: fadeIn 0.5s ease;">✅</div>
          <h2 class="display-sm mb-xs">Report Submitted!</h2>
          <p class="body-lg text-muted mb-xl">Thank you for making Bhopal better.</p>
          
          <div class="card mb-xl" style="width: 100%; max-width: 350px;">
            <div class="label-md text-muted text-center mb-xs">Issue Tracking ID</div>
            <div class="display-md text-center" style="color: var(--brand-navy); font-weight: 700; letter-spacing: 2px;" id="success-id">BH-XXXXX</div>
            <div class="text-center mt-md">
              <span class="badge badge-warning"><span class="status-dot inactive"></span> Under Review</span>
            </div>
          </div>

          <div class="flex flex-column gap-md" style="width: 100%; max-width: 350px;">
            <a href="#/citizen/track" class="btn btn-primary" style="width: 100%; justify-content: center;">Track Issue Status</a>
            <a href="#/citizen" class="btn btn-secondary" style="width: 100%; justify-content: center;">Back to Dashboard</a>
          </div>
        </div>
      </div>

      <div class="bottom-nav-spacer"></div>

      <!-- WIZARD ACTIONS -->
      <div class="wizard-actions" id="wizard-actions">
        <button class="btn btn-secondary" id="btn-back" style="flex: 1; display: none;">Back</button>
        <button class="btn btn-primary" id="btn-next" style="flex: 1;" disabled>Next</button>
      </div>

    </div>
  `;
}

export function initCitizenReport() {
  const state = {
    category: null,
    location: null,
    evidenceDataUrl: null,
    description: ''
  };
  
  let currentStep = 1;
  const totalSteps = 5;

  const btnNext = document.getElementById('btn-next');
  const btnBack = document.getElementById('btn-back');
  const wizardActions = document.getElementById('wizard-actions');
  const progressBars = document.querySelectorAll('.wizard-progress-bar');
  const wizardProgress = document.getElementById('wizard-progress');

  // --- Step 1: Category ---
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.category-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      state.category = card.getAttribute('data-category');
      validateStep();
    });
  });

  // --- Step 2: Location ---
  const locInput = document.getElementById('loc-search');
  const locDisplay = document.getElementById('loc-display');
  if (locInput) {
    locInput.addEventListener('input', (e) => {
      state.location = e.target.value;
      locDisplay.textContent = state.location || "Move map to adjust pin";
      validateStep();
    });
  }
  const locCurrent = document.getElementById('loc-current');
  if (locCurrent) {
    locCurrent.addEventListener('click', () => {
      locInput.value = "MP Nagar Zone 1, Bhopal (GPS)";
      state.location = locInput.value;
      locDisplay.textContent = state.location;
      validateStep();
    });
  }

  // --- Step 3: Evidence ---
  const evidenceInput = document.getElementById('evidence-input');
  const evidenceReplace = document.getElementById('evidence-replace');
  const uploadZone = document.getElementById('evidence-upload-zone');
  const previewContainer = document.getElementById('evidence-preview-container');
  const previewImg = document.getElementById('evidence-preview-img');
  const removeBtn = document.getElementById('evidence-remove');

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        state.evidenceDataUrl = e.target.result;
        previewImg.src = state.evidenceDataUrl;
        uploadZone.style.display = 'none';
        previewContainer.style.display = 'block';
        validateStep();
      };
      reader.readAsDataURL(file);
    }
  };

  if (evidenceInput) evidenceInput.addEventListener('change', (e) => handleFile(e.target.files[0]));
  if (evidenceReplace) evidenceReplace.addEventListener('change', (e) => handleFile(e.target.files[0]));
  if (removeBtn) {
    removeBtn.addEventListener('click', () => {
      state.evidenceDataUrl = null;
      previewImg.src = '';
      uploadZone.style.display = 'block';
      previewContainer.style.display = 'none';
      validateStep();
    });
  }

  // --- Step 4: Description ---
  const descInput = document.getElementById('desc-input');
  const descCounter = document.getElementById('desc-counter');
  if (descInput) {
    descInput.addEventListener('input', (e) => {
      const val = e.target.value;
      if (val.length > 500) e.target.value = val.substring(0, 500);
      state.description = e.target.value;
      descCounter.textContent = `${state.description.length} / 500 characters`;
      validateStep();
    });
  }

  // --- Validation Logic ---
  const validateStep = () => {
    let isValid = false;
    if (currentStep === 1) isValid = !!state.category;
    if (currentStep === 2) isValid = !!state.location && state.location.trim().length > 0;
    if (currentStep === 3) isValid = !!state.evidenceDataUrl; // require image
    if (currentStep === 4) isValid = !!state.description && state.description.trim().length > 0;
    if (currentStep === 5) isValid = true; // Review step is always valid
    
    if (btnNext) btnNext.disabled = !isValid;
  };

  // --- Navigation Logic ---
  const updateUI = () => {
    // Toggle Step Visibility
    document.querySelectorAll('.wizard-step').forEach(s => s.classList.remove('active'));
    document.getElementById(`step-${currentStep}`).classList.add('active');

    // Update Progress Bar
    progressBars.forEach((bar, idx) => {
      if (idx < currentStep) bar.classList.add('active');
      else bar.classList.remove('active');
    });

    // Update Buttons
    if (currentStep === 1) {
      btnBack.style.display = 'none';
      btnNext.textContent = 'Next';
    } else if (currentStep === totalSteps) {
      btnBack.style.display = 'block';
      btnNext.textContent = 'Submit Report';
      // Populate review
      document.getElementById('review-cat').textContent = state.category;
      document.getElementById('review-loc').textContent = state.location;
      document.getElementById('review-desc').textContent = state.description;
      document.getElementById('review-img').src = state.evidenceDataUrl;
    } else {
      btnBack.style.display = 'block';
      btnNext.textContent = 'Next';
    }
    
    validateStep();
  };

  if (btnNext) {
    btnNext.addEventListener('click', async () => {
      
      // Duplicate Detection check at Step 4
      if (currentStep === 4) {
        btnNext.disabled = true;
        btnNext.innerHTML = 'Analyzing <span class="status-dot active" style="margin-left: 8px; animation: pulse 1s infinite;"></span>';
        
        try {
          const payload = {
            category: state.category,
            location: state.location,
            description: state.description
          };
          const match = await duplicateDetectionService.checkDuplicate(payload);
          
          if (match) {
            document.querySelectorAll('.wizard-step').forEach(s => s.classList.remove('active'));
            const dupStep = document.getElementById('step-duplicate');
            dupStep.innerHTML = renderDuplicateDetectionPanel(match);
            dupStep.classList.add('active');
            wizardActions.style.display = 'none';
            
            document.getElementById('btn-support-duplicate').addEventListener('click', () => {
               document.querySelectorAll('.wizard-step').forEach(s => s.classList.remove('active'));
               document.getElementById('step-success').classList.add('active');
               wizardActions.style.display = 'none';
               wizardProgress.style.display = 'none';
               document.getElementById('success-id').textContent = match.issue.id;
               const successTitle = document.querySelector('#step-success h2');
               if (successTitle) successTitle.textContent = 'Issue Supported!';
               const successDesc = document.querySelector('#step-success p');
               if (successDesc) successDesc.textContent = 'Thank you for adding your voice to this existing issue.';
            });
            
            document.getElementById('btn-report-separately').addEventListener('click', () => {
               currentStep = 5;
               wizardActions.style.display = 'flex';
               if (window.innerWidth >= 768) wizardActions.style.display = 'block'; // preserve desktop layout if needed, though flex is fine
               updateUI();
            });
            
            document.getElementById('btn-view-duplicate').addEventListener('click', () => {
               window.location.hash = '#/citizen/track';
            });
            
            return; // Wait for user choice, halt progression
          }
        } catch (e) {
          console.error("Duplicate check failed", e);
        } finally {
          btnNext.disabled = false;
          btnNext.innerHTML = 'Next';
        }
      }

      if (currentStep < totalSteps) {
        currentStep++;
        updateUI();
      } else {
        // Submit!
        btnNext.disabled = true;
        btnNext.innerHTML = 'Submitting <span class="status-dot active" style="margin-left: 8px; animation: pulse 1s infinite;"></span>';
        
        try {
          const payload = {
            title: `${state.category} Issue in ${state.location.split(',')[0]}`,
            category: state.category,
            description: state.description,
            location: state.location,
            imageUrl: state.evidenceDataUrl,
            priority: "Medium"
          };
          
          const newIssue = await issueService.createIssue(payload);
          
          // Show Success State
          document.querySelectorAll('.wizard-step').forEach(s => s.classList.remove('active'));
          document.getElementById('step-success').classList.add('active');
          wizardActions.style.display = 'none';
          wizardProgress.style.display = 'none';
          document.getElementById('success-id').textContent = newIssue.id;
          
        } catch (error) {
          console.error("Submission failed", error);
          alert("Submission failed. Please try again.");
          btnNext.disabled = false;
          btnNext.textContent = 'Submit Report';
        }
      }
    });
  }

  if (btnBack) {
    btnBack.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateUI();
      }
    });
  }

  // Initial render
  updateUI();
}
