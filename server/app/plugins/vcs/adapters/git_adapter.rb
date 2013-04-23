require 'grit'
require 'plugins/vcs/vcs_runtime_info'

module Jashboard
  module Plugin
    module Vcs
      module GitAdapter
        def get_git_runtime_info(configuration)
          repo = Grit::Repo.new(configuration.working_directory)
          branch = 'master'
          branch = configuration.branch unless configuration.branch.nil? || configuration.branch.empty?
          repo.commits(branch, configuration.history_length).map do |commit|
            VcsRuntimeInfo.new(
              commit.id,
              commit.authored_date,
              commit.author.name,
              commit.author.email,
              commit.message
            )
          end
        end
      end
    end
  end
end
