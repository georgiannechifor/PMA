import {useState, useEffect, useMemo} from 'react';
import {array} from 'prop-types';
import map from 'lodash/map';
import size from 'lodash/size';
import slice from 'lodash/slice';

import {Table, Modal, Loader, Pagination} from 'components';
import {getPropsFromFetch} from 'utils/getPropsFromFetch';
import {useFetch} from 'utils/useFetch';
import useSWR, {useSWRConfig} from 'swr';
import {teamsColumns, PAGE_SIZE} from 'constants/index';
import {CreateEditTeam} from 'components/modals';

// eslint-disable-next-line complexity, max-statements
const AdminTeams = ({defaultTeams, defaultUsers}) => {
  const {data: teams} = useSWR('/teams', {
    initialData : defaultTeams
  });
  const {data: users} = useSWR('/users', {
    initialData : defaultUsers
  });
  const {mutate} = useSWRConfig();


  const [createTeamModalOpen, setCreateTeamModalOpen] = useState(false);
  const [isRemovingModalOpen, setIsRemovingModalOpen] = useState(false);
  const [editTeamItem, setEditTeamItem] = useState({});

  const {
    result: {data, loading},
    fetchData
  } = useFetch('teams');


  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedTeams, setPaginatedTeams] = useState(teams);

  useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PAGE_SIZE;
    const lastPageIndex = firstPageIndex + PAGE_SIZE;

    setPaginatedTeams(slice(teams, firstPageIndex, lastPageIndex));
  }, [currentPage, teams]);


  const removeTeam = () => {
    fetchData({
      entityId : editTeamItem._id,
      method   : 'DELETE'
    });
  };

  useEffect(() => {
    if (data) {
      setIsRemovingModalOpen(false);
      mutate('/teams');
    }
    // eslint-disable-next-line
  }, [data]);

  return (
    <Loader isLoading={loading}>
      <div className="w-11/12 mx-auto flex flex-col">
        <section className="flex items-center justify-between">
          <h1 className="text-xl font-medium py-4"> Company Teams </h1>
          <button
            className="px-5 py-2 bg-indigo-600 rounded text-white font-medium text-md hover:bg-indigo-700 transition"
            onClick={() => setCreateTeamModalOpen(true)}
          >
            Create Team
          </button>
        </section>

        <Table
          columns={teamsColumns}
          data={map(paginatedTeams, item => ({
            ...item,
            admin : {
              ...item.admin,
              fullName : item.admin?.firstName + ' ' + item.admin?.lastName
            }
          }))}
          onDeleteItem={item => {
            setEditTeamItem(item);
            setIsRemovingModalOpen(true);
          }}
          onEdit={item => {
            setEditTeamItem(item);
            setCreateTeamModalOpen(true);
          }}
          onRowClick={item => {
            setEditTeamItem(item);
          }}
        />

        <CreateEditTeam
          mutate={mutate}
          selectedTeam={editTeamItem}
          setSelectedTeam={setEditTeamItem}
          setVisible={setCreateTeamModalOpen}
          users={users}
          visible={createTeamModalOpen}
        />

        <Modal
          isModalOpen={isRemovingModalOpen}
          modalActions={
            <div className="flex w-full items-center justify-end gap-2">
              <button
                className="px-4 py-2 text-sm font-medium focus:border-none focus:outline-none hover:text-gray-400 transition"
                onClick={() => {
                  setIsRemovingModalOpen(false);
                }}
              >
                Cancel
              </button>
              <button className="px-8 py-2 text-sm text-white font-medium bg-red-500 rounded-lg" onClick={() => removeTeam()}>
                Remove
              </button>
            </div>
          }
          modalContent={<p> Are you sure you want to remove {editTeamItem?.name} ?</p>}
          modalTitle="Remove confirmation"
          setIsModalOpen={setIsRemovingModalOpen}
        />

        <div className="w-full">
          <Pagination
            currentPage={currentPage} onPageChange={page => setCurrentPage(page)} pageSize={PAGE_SIZE}
            totalCount={size(paginatedTeams)}
          />
        </div>
      </div>
    </Loader>
  );
};

AdminTeams.getInitialProps = async ctx => {
  try {
    const {data: teams} = await getPropsFromFetch('/teams', ctx);
    const {data: users} = await getPropsFromFetch('/users', ctx);

    return {
      defaultTeams : teams,
      defaultUsers : users
    };
  } catch {
    return {};
  }
};

AdminTeams.displayName = 'AdminTeams';
AdminTeams.propTypes = {
  defaultTeams : array.isRequired,
  defaultUsers : array.isRequired
};

export default AdminTeams;
