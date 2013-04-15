require 'grit'
require 'plugins/vcs/vcs_runtime_info'

module Jashboard
  module Plugin
    module Vcs
      module GitAdapter
        def get_git_runtime_info(configuration)
          repo = Grit::Repo.new(configuration.working_directory)
          branch = configuration.branch || 'master'
          repo.commits(branch, configuration.history_length).map do |commit|
            VcsRuntimeInfo.new(
              commit.id,
              commit.authored_date.strftime("%a %b %d %H:%M:%S %Y %z"),
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
