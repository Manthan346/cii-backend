import API from '../api';

const toShortName = (organization = '') => {
  const initials = organization
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  return initials || organization;
};

/** Fetches the profile for the authenticated HR/recruiter user. */
export async function fetchRecruiterProfile() {
  const response = await API.get('/hr/profile');
  const profile = response.data?.data ?? {};
  const organization = profile.organization_name ?? '';

  return {
    name: profile.name ?? '',
    designation: profile.designation ?? '',
    organization,
    organizationShort: toShortName(organization),
    email: profile.organization_email ?? '',
    phone: profile.phone_no ?? '',
  };
}
