const tabs = document.querySelectorAll('.tabs');

tabs.forEach((element) => {
  const segments = element.querySelectorAll('[role="tab"]');

  const resetSegment = () => {
    element.querySelector('[role="tab"][aria-selected="true"]').removeAttribute('aria-selected');
  };

  const setActiveSegment = (segment) => {
    resetSegment();
    segment.setAttribute('aria-selected', true);
  };

  const resetTab = () => {
    element.querySelector('[role="tabpanel"][aria-hidden="false"]').setAttribute('aria-hidden', true);
  };

  const setActiveTab = (tabID) => {
    resetTab();

    const tab = element.querySelector(`[data-tab-id="${tabID}"]`);
    tab.setAttribute('aria-hidden', false);
  };

  segments.forEach((segment) => {
    segment.addEventListener('click', (e) => {
      e.preventDefault();

      setActiveSegment(e.currentTarget);
      setActiveTab(e.currentTarget.getAttribute('data-tab'));
    });
  });
});
