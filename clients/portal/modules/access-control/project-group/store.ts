import { observable, action, reaction } from 'mobx';

import toast from '@lib/toast';

import {
  ProjectParams,
  Project,
  fetchProjectList,
  createProject,
  associatePerson,
  AssociateParams,
  getAssociatePerson,
  ProjectWithPerson,
  deleteProject,
  editProject,
} from './api';

class ProjectGroupStore {
  @observable curProject?: Project;
  @observable projectParams: ProjectParams = {
    page: 1,
    size: 10,
  };
  @observable total = 0;
  @observable projectList: Project[] = [];
  @observable projectListLoading = false;
  @observable isFetchPersonalLoading = false;
  @observable allScopes: ProjectWithPerson[] = [];

  constructor() {
    reaction(() => this.projectParams, this.fetchProjectList);
  }

  @action
  setCurProject = (project?: Project): void => {
    this.curProject = project;
  };

  @action
  setTotal = (total: number): void => {
    this.total = total;
  };

  @action
  setScope = (scope: ProjectWithPerson[]): void => {
    this.allScopes = scope;
  };

  @action
  setProjectParams = (newParam: Partial<ProjectParams>): void => {
    this.projectParams = { ...this.projectParams, ...newParam };
  };

  @action
  setProjectList = (projectList: Project[]): void => {
    this.projectList = projectList;
  };

  @action
  fetchProjectList = (): Promise<void> => {
    this.projectListLoading = true;
    return fetchProjectList(this.projectParams).then((res: {list: Project[], total: number;}) => {
      this.setProjectList(res.list);
      this.setTotal(res.total);
    }).finally(() => {
      this.projectListLoading = false;
    });
  };

  @action
  createProject = (
    projectInfo: Omit<Project, 'id'>,
    person: Omit<AssociateParams, 'projectID'|'projectName'>,
  ): Promise<void> => {
    return createProject(projectInfo) .then(({ id }) => {
      const { name } = projectInfo;
      this.associatePerson({
        projectID: id,
        projectName: name,
        ...person,
      }).then(() => {
        toast.success('项目创建成功');
        this.projectList = [{ id, ...projectInfo }, ...this.projectList];
      });
    }).catch((err) => {
      toast.error('项目保存失败: ', err.message);
    });
  };

  @action
  associatePerson = (params: AssociateParams): Promise<void> => {
    return associatePerson(params).then(() => {
    }).catch((err) => {
      toast.error('绑定: ', err.message);
    });
  };

  @action
  getAssociatePerson = (): void => {
    if (!this.curProject) return;
    this.isFetchPersonalLoading = true;
    const { id } = this.curProject;
    getAssociatePerson(
      { page: 1, size: 9999, projectID: id },
    ).then(({ list }) => {
      this.allScopes = list;
    }).catch((err) => {
      toast.error(err);
    }).finally(() => {
      this.isFetchPersonalLoading = false;
    });
  };

  @action
  delProject = async (projectID: string): Promise<void> => {
    return await deleteProject(projectID).then(() => {
      this.setProjectList(this.projectList.filter(({ id }) => id !== projectID));
      toast.success('项目删除成功');
    }).catch(() => {
      toast.error('项目删除成功');
    });
  };

  @action
  editProject = (
    projectInfo: Project,
    person: Omit<AssociateParams, 'projectID' | 'projectName'>,
  ): Promise<void> => {
    return editProject(projectInfo) .then(() => {
      const { name, id } = projectInfo;
      this.associatePerson({
        projectID: id,
        projectName: name,
        ...person,
      }).then(() => {
        this.projectList = this.projectList.map((project) => {
          if (project.id === projectInfo.id) {
            this.curProject = { ...project, ...projectInfo };
            return { ...project, ...projectInfo };
          }

          return project;
        });
        toast.success('修改成功！');
      });
    }).catch((err) => {
      toast.error('项目修改失败: ', err.message);
    });
  };
}

export default new ProjectGroupStore();
