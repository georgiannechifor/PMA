import {array} from 'prop-types';
import {getPropsFromFetch} from 'utils/getPropsFromFetch';
import {Table} from 'components';
import map from 'lodash/map';

const AdminTeams = ({
  teams
}) => {
  const teamsColumns = [
    {
      key   : 'name',
      title : 'Team Name'
    },
    {
      key   : 'admin.fullName',
      title : 'Admin Name'
    }
  ];


  return (
    <div className="w-full flex flex-col">
      <h1 className="text-xl font-medium py-4"> Company Teams </h1>

      <div className="flex-1">
        <Table
          columns={teamsColumns}
          data={teams}
          onRowClick={item => console.log(item)} // eslint-disable-line
        />
      </div>
    </div>
  );
};

AdminTeams.getInitialProps = async ctx => {
  try {
    const {data} = await getPropsFromFetch('/teams', ctx);

    const mappedData = map(data, team => ({
      ...team,
      admin : {
        ...team.admin,
        fullName : team.admin.firstName + ' ' + team.admin.lastName
      }
    }));


    return {
      teams : mappedData
    };
  } catch {
    return {};
  }
};

AdminTeams.displayName = 'AdminTeams';
AdminTeams.propTypes = {
  teams : array.isRequired
};

export default AdminTeams;
