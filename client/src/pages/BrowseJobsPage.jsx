import React from 'react';
import OpportunityDiscovery from '../components/OpportunityDiscovery';

const BrowseJobsPage = () => {
  return <OpportunityDiscovery opportunityType="Job" syncUrl={true} />;
};

export default BrowseJobsPage;
