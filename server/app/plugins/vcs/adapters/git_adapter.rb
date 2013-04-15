require 'grit'
require 'plugins/vcs/vcs_runtime_info'

module Jashboard
  module Plugin
    module VCS
      module GitAdapter
        def get_git_runtime_info(configuration)
          repo = Grit::Repo.new(configuration.working_directory)
          branch = configuration.branch || 'master'
          repo.commits(branch, configuration.history_length).map do |commit|
            VcsRevisionInfo.new(
              commit.id,
              commit.committed_date.strftime("%a %b %d %H:%M:%S %Y %z"),
              "#{commit.committer.name} <#{commit.committer.email}>",
              commit.message
            )
          end
        end
      end
    end
  end
end
