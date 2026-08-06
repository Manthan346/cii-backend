// Derives the ProfileCompletionCard's label + checklist from the actual
// basicInformation payload returned by GET /instructor-profile, instead
// of hardcoded mock booleans. The overall `percent` still comes straight
// from the backend's `profileCompletion` field (computed across ALL
// instructor_details columns), so it can be a bit ahead of what this
// 2-item checklist shows - that's expected, not a bug.
//
// "Upload ID Proof" and "Resume Added" are intentionally left out: that
// data lives under the Documents endpoint, not basic-information. Wire
// those back in here once StudyMaterialUpload/Documents is fetched the
// same way, by checking profileDocuments for those two doc types.

export function getCompletionLabel(percent) {
  if (percent >= 90) return 'All Set!';
  if (percent >= 70) return 'Almost There!!';
  if (percent >= 40) return 'Halfway There';
  return 'Just Getting Started';
}

export function getCompletionChecklist({ personalInformation, contactDetails }) {
  const personalFilled = Boolean(
    personalInformation?.name &&
      personalInformation?.gender &&
      personalInformation?.dateOfBirth &&
      personalInformation?.bloodGroup &&
      personalInformation?.highestQualification,
  );

  const contactFilled = Boolean(
    contactDetails?.mobileNumber && contactDetails?.email,
  );

  return [
    { id: 'basic-info', label: 'Basic Information added', done: personalFilled },
    { id: 'contact-verified', label: 'Contact Details added', done: contactFilled },
  ];
}
