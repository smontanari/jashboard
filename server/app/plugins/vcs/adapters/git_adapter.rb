require 'rugged'
require 'plugins/vcs/vcs_runtime_info'

module Jashboard
  module Plugin
    module Vcs
      module GitAdapter
        def get_git_runtime_info(configuration)
          branch = 'master'
          branch = configuration.branch unless configuration.branch.nil? || configuration.branch.empty?
          repo = Rugged::Repository.discover(configuration.working_directory)
          walker = Rugged::Walker.new(repo)
          walker.sorting(Rugged::SORT_DATE)
          walker.push(repo.branches[branch].target_id)
          walker.first(configuration.history_length).map do |commit|
            VcsRuntimeInfo.new(
              commit.oid,
              commit.time,
              commit.author[:name],
              commit.author[:email],
              commit.message.strip
            )
          end
        end
      end
    end
  end
end
