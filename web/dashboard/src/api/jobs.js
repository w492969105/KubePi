import { get, post, del, put } from "@/plugins/request";

const jobUrl = (cluster_name) => {
  return `/api/v1/proxy/${cluster_name}/k8s/apis/batch/v1/jobs`;
};
const jobUrlWithNs = (cluster_name, namespace) => {
  return `/api/v1/proxy/${cluster_name}/k8s/apis/batch/v1/namespaces/${namespace}/jobs`;
};

export function listJobs(cluster_name,  search) {
  let url = jobUrl(cluster_name);
  if (search && search !== "") {
    url += "&fieldSelector=metadata.name=" + search;
  }
  return get(url);
}

export function listJobsWithNsSelector(cluster_name, namespace, selectors) {
  let url = jobUrlWithNs(cluster_name, namespace);
  const param = {};
  if (selectors && selectors !== "") {
    param.labelSelector = selectors;
  }
  return get(url, param);
}

export function getJobByName(cluster_name, namespace, job) {
  return get(`${jobUrlWithNs(cluster_name, namespace)}/${job}`);
}

export function deleteJob(cluster_name, job) {
  const deleteOptions = {
    propagationPolicy: 'Background'
  };

  console.log('deleteJob function called with:');
  console.log('cluster_name:', cluster_name);
  console.log('job:', job);
  console.log('deleteOptions:', deleteOptions);

  const url = `${jobUrl(cluster_name)}/${job}`;
  console.log('Constructed URL:', url);

  console.log('Calling del function with:');
  console.log('URL:', url);
  console.log('Data:', { data: deleteOptions });

  const result = del(url, { data: deleteOptions });

  console.log('del function returned:', result);

  // 由于 result 可能是一个 Promise，我们可以添加一些额外的日志
  result.then(
    response => console.log('Delete job succeeded:', response),
    error => console.error('Delete job failed:', error)
  );

  return result;
}

export function createJob(cluster_name, job) {
  return post(`${jobUrl(cluster_name)}/${job}`);
}

export function updateJob(cluster_name, job) {
  return put(`${jobUrlWithNs(cluster_name)}/${job}`);
}
