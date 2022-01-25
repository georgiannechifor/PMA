import {useState, useEffect} from 'react';
import {array} from 'prop-types';
import map from 'lodash/map';
import unionBy from 'lodash/unionBy';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import * as cx from 'classnames';
import {getPropsFromFetch} from 'utils/getPropsFromFetch';
import {Table, Modal, Select, Loader} from 'components';
import {useFetch} from 'utils/useFetch';

// eslint-disable-next-line complexity
const AdminTeams = ({
  teams,
  users
}) => {
  const formSchema = Yup.object().shape({
    teamName : Yup.string()
      .required('Team Name is required'),
    admin : Yup.string().required('Team Admin is required')
  });
  const validationOptions = {resolver : yupResolver(formSchema)};

  const [createTeamModalOpen, setCreateTeamModalOpen] = useState(false);
  const [editTeamModalOpen, setEditTeamModalOpen] = useState(false);
  const [editTeamItem, setEditTeamItem] = useState({});
  const [selectedTeamAdmin, setSelectedTeamAdmin] = useState({});

  const {result: {data, loading, error}, fetchData} = useFetch('teams');
  const {register, handleSubmit, setValue, formState: {errors}} = useForm(validationOptions);

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

  const onSubmit = formdata => {
    fetchData({
      method : 'POST',
      data   : {
        name  : formdata.teamName,
        admin : formdata.admin
      }
    });
  };

  useEffect(() => {
    if (data && data.name) {
      setCreateTeamModalOpen(false);
      fetchData();
    }
  }, [data]);

  return (
    <Loader isLoading={loading}>
      <div className="w-full flex flex-col">
        <section className="w-5/6 mx-auto flex items-center justify-between">
          <h1 className="text-xl font-medium py-4"> Company Teams </h1>
          <button
            className="px-5 py-2 bg-blue-500 rounded text-white font-medium text-md"
            onClick={() => setCreateTeamModalOpen(true)}
          > Create Team </button>
        </section>

        <div className="flex-1">
          <Table
            columns={teamsColumns}
            data={unionBy(
              teams,
              map(data, dataItem => ({
                ...dataItem,
                admin : {
                  ...dataItem.admin,
                  fullName : dataItem.admin.firstName + ' ' + dataItem.admin.lastName
                }
              })),
              // eslint-disable-next-line no-underscore-dangle
              item => item._id)}
            onRowClick={item => {
              setEditTeamItem(item);
              setEditTeamModalOpen(true);
            }}
          />
        </div>

        <Modal
          isModalOpen={createTeamModalOpen}
          modalActions={(
            <div className="flex w-full items-center justify-end gap-2">
              <button
                className="px-4 py-2 text-sm font-medium focus:border-none focus:outline-none hover:text-gray-400 transition"
                onClick={() => setCreateTeamModalOpen(false)}
              > Cancel </button>
              <button
                className="px-8 py-2 text-sm text-white font-medium bg-blue-500 rounded-lg"
                onClick={handleSubmit(onSubmit)}
              > Save </button>
            </div>
          )}
          modalContent={(
            <div>
              <input
                {...register('teamName')}
                className={cx(
                  'text-sm placeholder-gray-500 rounded-lg border border-gray-400 w-full py-2 px-4 focus:outline-none',
                  {'border-1 border-red-400' : errors.teamName}
                )}
                placeholder="Team Name"
                type="text"
              />
              {
                errors &&
                errors.teamName &&
                <p className="my-1 text-red-500 text-xs font-medium"> { errors.teamName.message }</p>
              }

              <div className="mt-5">
                <Select
                  errorClassname={errors.admin ? 'border-1 border-red-400' : ''}
                  onChange={event => {
                    setSelectedTeamAdmin(event);
                    setValue('admin', event.value, {
                      shouldValidate : true
                    });
                  }}
                  options={users.map(user => ({
                  // eslint-disable-next-line no-underscore-dangle
                    value : user._id,
                    name  : user.firstName + ' ' + user.lastName
                  }))}
                  value={selectedTeamAdmin}
                />
              </div>
              {
                errors &&
                errors.admin &&
                <p className="my-1 text-red-500 text-xs font-medium"> { errors.admin?.message }</p>
              }

              {
                error && error.message && (
                  <p className="my-1 text-red-500 text-xs font-medium"> { error.message }</p>
                )
              }
            </div>
          )}
          modalTitle="Create Team"
          setIsModalOpen={setCreateTeamModalOpen}
        />
      </div>
    </Loader>
  );
};

AdminTeams.getInitialProps = async ctx => {
  try {
    const {data} = await getPropsFromFetch('/teams', ctx);
    const {data: users} = await getPropsFromFetch('/users', ctx);

    const mappedData = map(data, team => ({
      ...team,
      admin : {
        ...team.admin,
        fullName : team.admin.firstName + ' ' + team.admin.lastName
      }
    }));


    return {
      teams : mappedData,
      users
    };
  } catch {
    return {};
  }
};

AdminTeams.displayName = 'AdminTeams';
AdminTeams.propTypes = {
  teams : array.isRequired,
  users : array.isRequired
};

export default AdminTeams;
