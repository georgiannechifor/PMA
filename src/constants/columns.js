export const eventsColumns = [
  {
    key   : 'title',
    title : 'Event Name'
  },
  {
    key     : 'date',
    options : 'DD MMM, YYYY',
    isDate  : true,
    title   : 'Date'
  },
  {
    key   : 'startTime',
    title : 'Start Time'
  },
  {
    key   : 'endTime',
    title : 'End Time'
  },
  {
    key   : 'author.firstName',
    title : 'Author'
  },
  {
    key   : 'assignee.firstName',
    title : 'Assignee'
  }
];

export const projectsColumns = [
  {
    key   : 'name',
    title : 'Name'
  }, {
    key   : 'deadline',
    title : 'Deadline'
  }, {
    key   : 'team.name',
    title : 'Team Name'
  }
];

export const teamsColumns = [
  {
    key   : 'name',
    title : 'Team Name'
  },
  {
    key   : 'admin.fullName',
    title : 'Admin Name'
  }
];

export const userColumns = [
  {
    key   : 'firstName',
    title : 'First Name'
  }, {
    key   : 'lastName',
    title : 'Last Name'
  }, {
    key   : 'email',
    title : 'Email'
  }, {
    key   : 'team.name',
    title : 'Team Name'
  }, {
    key   : 'jobTitle',
    title : 'Position'
  }
];

export const deploymentColumns = [
  {
    key   : 'title',
    title : 'Deployment name'
  }, {
    key   : 'date',
    title : 'Date'
  }, {
    key   : 'project.name',
    title : 'Project Name'
  }, {
    key   : 'author.fullName',
    title : 'Author'
  }
];
